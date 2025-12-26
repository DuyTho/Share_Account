import { Request, Response } from "express";
import prisma from "../prisma";

// Lấy danh sách gói đăng ký của 1 user
export const getUserSubscriptions = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  try {
    const subs = await prisma.subscriptions.findMany({
      where: { user_id: Number(user_id) },
      include: { Products: true }, // Lấy tên gói
      orderBy: { end_date: "desc" }, // Gói mới nhất lên đầu
    });
    res.json(subs);
  } catch (error) {
    res.status(500).json({ error: "Lỗi lấy danh sách gói" });
  }
};

// Hàm gia hạn subscription
export const renewSubscription = async (req: Request, res: Response) => {
  try {
    const { sub_id } = req.body;

    // Tìm subscription cũ
    const oldSubscription = await prisma.subscriptions.findUnique({
      where: { sub_id },
      include: { Products: true, Users: true },
    });

    if (!oldSubscription) {
      return res.status(404).json({ error: "Subscription không tồn tại." });
    }

    // Tạo đơn hàng mới dựa trên subscription cũ
    const newOrder = await prisma.orders.create({
      data: {
        user_id: oldSubscription.user_id,
        product_id: oldSubscription.product_id,
        total: oldSubscription.Products.price,
        payment_status: "pending",
      },
    });

    res.json({
      message: "Đã tạo đơn hàng mới để gia hạn.",
      order_id: newOrder.order_id,
      redirect_url: `/payment/${newOrder.order_id}`,
    });
  } catch (error) {
    console.error("Lỗi khi gia hạn subscription:", error);
    res.status(500).json({ error: "Lỗi khi gia hạn subscription." });
  }
};
