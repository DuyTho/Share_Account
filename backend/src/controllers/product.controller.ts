import { Request, Response } from 'express'
import prisma from '../prisma'

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.products.findMany()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách sản phẩm' })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  const { name, duration_months, price, description } = req.body
  try {
    const newProduct = await prisma.products.create({
      data: {
        name,
        duration_months: Number(duration_months),
        price: Number(price),
        description,
        is_active: true
      }
    })
    res.json(newProduct)
  } catch (error) {
    res.status(500).json({ error: 'Không tạo được sản phẩm' })
  }
}