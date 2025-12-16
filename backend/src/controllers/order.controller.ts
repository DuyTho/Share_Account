import { Request, Response } from 'express'
import prisma from '../prisma'

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.orders.findMany({
      include: { Users: true, Products: true }
    })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách đơn hàng' })
  }
}

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