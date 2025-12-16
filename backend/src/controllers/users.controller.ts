import { Request, Response } from 'express'
import prisma from '../prisma'

// Lấy danh sách user
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách user' })
  }
}

// Tạo user mới
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body
  try {
    const newUser = await prisma.users.create({
      data: { name, email, password, phone, role: 'customer', status: 'active' }
    })
    res.json(newUser)
  } catch (error) {
    res.status(500).json({ error: 'Không tạo được user' })
  }
}