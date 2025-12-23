import { Request, Response } from 'express'
import prisma from '../prisma'
import { sendPaymentSuccessEmail } from '../utils/mailer';
import { inviteToFamily } from '../services/googleBot';

// 1. API ADMIN: Lấy danh sách toàn bộ đơn hàng (Đổ data ra bảng Admin)
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.orders.findMany({
      orderBy: { date: 'desc' }, // Mới nhất lên đầu
      include: {
        Users: {
          select: { name: true, email: true } // Lấy tên, email khách
        },
        Products: {
          select: { name: true, duration_months: true } // Lấy tên gói, thời hạn
        },
        Subscriptions: {
          select: { end_date: true, status: true } // Lấy ngày hết hạn thực tế
        }
      }
    });

    // Format dữ liệu để Frontend dễ hiển thị
    const formattedOrders = orders.map(order => ({
      order_id: order.order_id,
      user: {
        name: order.Users.name,
        email: order.Users.email
      },
      product: {
        name: order.Products.name,
        duration: order.Products.duration_months
      },
      amount: order.total,
      status: order.payment_status, // pending, paid, cancelled
      created_at: order.date,
      // Logic ngày hết hạn: Lấy từ Subscriptions hoặc tính tạm
      expiry_date: order.Subscriptions.length > 0 
        ? order.Subscriptions[0].end_date 
        : new Date(new Date(order.date || Date.now()).setMonth(new Date(order.date || Date.now()).getMonth() + order.Products.duration_months))
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi lấy danh sách đơn hàng' });
  }
}

// 2. API USER: Lấy lịch sử đơn hàng của 1 user cụ thể
export const getUserOrders = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  try {
    const orders = await prisma.orders.findMany({
      where: { user_id: Number(user_id) },
      include: { Products: true },
      orderBy: { date: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Lỗi lấy lịch sử đơn hàng" });
  }
};

// 3. API ADMIN: Cập nhật trạng thái đơn (Nút Done / Cancel)
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'paid' hoặc 'cancelled'

  try {
    // Cập nhật bảng Order
    const updatedOrder = await prisma.orders.update({
      where: { order_id: Number(id) },
      data: { payment_status: status }
    });

    // Nếu Admin duyệt (paid) -> Kích hoạt Subscription đang chờ
    if (status === 'paid') {
      await prisma.subscriptions.updateMany({
        where: { order_id: Number(id) },
        data: { status: 'active' }
      });
    }

    // Nếu Admin hủy (cancelled) -> Hủy Subscription
    if (status === 'cancelled') {
        await prisma.subscriptions.updateMany({
            where: { order_id: Number(id) },
            data: { status: 'expired' }
        });
    }

    res.json({ message: "Cập nhật thành công", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: "Lỗi cập nhật đơn hàng" });
  }
};

// 4. API ADMIN: Xóa đơn hàng (Nút Delete)
export const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // Phải xóa Subscriptions liên quan trước (do khóa ngoại)
        await prisma.subscriptions.deleteMany({
            where: { order_id: Number(id) }
        });

        // Sau đó xóa Order
        await prisma.orders.delete({
            where: { order_id: Number(id) }
        });

        res.json({ message: "Đã xóa đơn hàng" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Không thể xóa đơn hàng này" });
    }
}

// 5. API CHECKOUT: Xử lý thanh toán tự động (Giữ nguyên logic cũ của bạn)
export const checkout = async (req: Request, res: Response) => {
  const { user_id } = req.body;

  try {
    const cartItems = await prisma.cartItems.findMany({
      where: { user_id: Number(user_id) },
      include: { Products: true, Users: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Giỏ hàng trống" });
    }

    const userInfo = cartItems[0].Users;
    const firstItem = cartItems[0];

    const result = await prisma.$transaction(async (tx) => {
      const availableMaster = await tx.masterAccounts.findFirst({
        where: { status: 'active', used_slots: { lt: 5 } }
      });

      if (!availableMaster) throw new Error("Hết slot tài khoản chủ. Liên hệ Admin!");

      const newOrder = await tx.orders.create({
        data: {
          user_id: Number(user_id),
          product_id: firstItem.product_id,
          total: firstItem.Products.price,
          payment_method: "BANK_TRANSFER", 
          payment_status: "paid"
        }
      });

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + firstItem.Products.duration_months);

      await tx.subscriptions.create({
        data: {
          user_id: Number(user_id),
          product_id: firstItem.product_id,
          order_id: newOrder.order_id,
          master_id: availableMaster.master_id,
          start_date: startDate,
          end_date: endDate,
          status: 'active'
        }
      });

      const newUsedSlots = (availableMaster.used_slots || 0) + 1;
      await tx.masterAccounts.update({
        where: { master_id: availableMaster.master_id },
        data: {
          used_slots: newUsedSlots,
          status: newUsedSlots >= (availableMaster.max_slots || 5) ? 'full' : 'active'
        }
      });

      await tx.cartItems.deleteMany({ where: { user_id: Number(user_id) } });

      return { newOrder, availableMaster };
    });

    await sendPaymentSuccessEmail(userInfo.email, userInfo.name, firstItem.Products.name, result.newOrder.order_id);

    res.status(200).json({
      message: "Thanh toán thành công! Hệ thống đang xử lý.",
      order_id: result.newOrder.order_id
    });

    console.log("🚀 Kích hoạt Bot sau 5 giây...");
    setTimeout(() => {
      inviteToFamily(userInfo.email)
        .then(() => console.log(`✅ [BOT SUCCESS] Đã mời: ${userInfo.email}`))
        .catch((err) => console.error(`❌ [BOT FAILED] Mời thất bại:`, err));
    }, 5000);

  } catch (error: any) {
    console.error("Lỗi checkout:", error);
    res.status(500).json({ error: error.message || "Lỗi xử lý đơn hàng" });
  }
};

// 6. Create Order thủ công (Nếu cần giữ lại)
export const createOrder = async (req: Request, res: Response) => {
  const { user_id, product_id, total, payment_method } = req.body
  try {
    const newOrder = await prisma.orders.create({
      data: {
        total: Number(total),
        payment_method: payment_method || 'unknown',
        Users: { connect: { user_id: Number(user_id) } },
        Products: { connect: { product_id: Number(product_id) } }
      }
    })
    res.json(newOrder)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Không tạo được đơn hàng' })
  }
}