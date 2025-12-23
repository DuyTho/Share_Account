import { Request, Response } from 'express';
import prisma from '../prisma';

// Lấy danh sách gói đăng ký của 1 user
export const getUserSubscriptions = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  try {
    const subs = await prisma.subscriptions.findMany({
      where: { user_id: Number(user_id) },
      include: { Products: true }, // Lấy tên gói
      orderBy: { end_date: 'desc' } // Gói mới nhất lên đầu
    });
    res.json(subs);
  } catch (error) {
    res.status(500).json({ error: "Lỗi lấy danh sách gói" });
  }
};