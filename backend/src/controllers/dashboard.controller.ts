import { Request, Response } from 'express';
import prisma from '../prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // --- 1. TÍNH TỔNG DOANH THU (Liên quan bảng Orders) ---
    // Chỉ tính những đơn đã thanh toán (payment_status = 'paid')
    const revenueAgg = await prisma.orders.aggregate({
      _sum: { total: true },
      where: { payment_status: 'paid' }
    });
    // Prisma trả về Decimal, cần ép kiểu về Number
    const totalRevenue = Number(revenueAgg._sum.total || 0);


    // --- 2. THỐNG KÊ ĐƠN HÀNG (Liên quan bảng Orders) ---
    const totalOrders = await prisma.orders.count();
    const pendingOrders = await prisma.orders.count({ where: { payment_status: 'pending' } });
    const paidOrders = await prisma.orders.count({ where: { payment_status: 'paid' } });
    const cancelledOrders = await prisma.orders.count({ where: { payment_status: 'cancelled' } });


    // --- 3. THỐNG KÊ NGƯỜI DÙNG (Liên quan bảng Users) ---
    const totalUsers = await prisma.users.count({
      where: { role: 'customer' } // Chỉ đếm khách hàng, không đếm admin
    });


    // --- 4. THỐNG KÊ GÓI DỊCH VỤ (Liên quan bảng Subscriptions) ---
    const activeSubs = await prisma.products.count({
    });


    // --- 5. LẤY ĐƠN HÀNG MỚI NHẤT (Cho bảng Recent Orders) ---
    const recentOrders = await prisma.orders.findMany({
      take: 5, // Lấy 5 đơn gần nhất
      orderBy: { date: 'desc' },
      include: {
        Users: { select: { name: true, email: true } },
        Products: { select: { name: true } }
      }
    });

    // Format lại data recentOrders cho gọn đẹp
    const formattedRecent = recentOrders.map(order => ({
      id: order.order_id,
      customer: order.Users.name,
      email: order.Users.email,
      package: order.Products.name,
      amount: Number(order.total),
      status: order.payment_status,
      date: order.date
    }));


    // --- 6. (NÂNG CAO) DATA BIỂU ĐỒ DOANH THU 12 THÁNG ---
    // Logic: Lấy tất cả đơn 'paid', sau đó group by tháng bằng Javascript
    // (Lưu ý: Nếu dữ liệu lớn hàng triệu dòng thì cần dùng raw query SQL, nhưng với quy mô nhỏ thì cách này ổn)
    const allPaidOrders = await prisma.orders.findMany({
      where: { payment_status: 'paid' },
      select: { date: true, total: true }
    });

    // Tạo mảng 12 tháng mặc định bằng 0
    const monthlyRevenue = Array(12).fill(0);

    allPaidOrders.forEach(order => {
      if (order.date) {
        const month = new Date(order.date).getMonth(); // Tháng 0 - 11
        monthlyRevenue[month] += Number(order.total);
      }
    });


    // --- TRẢ VỀ KẾT QUẢ ---
    res.json({
      cards: {
        revenue: totalRevenue,
        orders: totalOrders,
        users: totalUsers,
        active_subs: activeSubs
      },
      order_stats: {
        pending: pendingOrders,
        paid: paidOrders,
        cancelled: cancelledOrders
      },
      chart_data: monthlyRevenue, // Mảng [Tháng 1, Tháng 2, ...]
      recent_orders: formattedRecent
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: "Lỗi lấy dữ liệu Dashboard" });
  }
};