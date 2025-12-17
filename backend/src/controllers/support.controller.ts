import { Request, Response } from 'express'
import prisma from '../prisma'

export const getSupport = async (req: Request, res: Response) => {
  try {
    const support = await prisma.support.findMany()
    res.json(support)
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách hỗ trợ' })
  }
}

export const createSupport = async (req: Request, res: Response) => {
  try {
    const { ticket_id, user_id, subject, message, status } = req.body
    const support = await prisma.support.create({
      data: {
        ticket_id,
        user_id,
        subject,
        message,
        status,
      },
    })
    res.json(support)
  } catch (error) {
    res.status(500).json({ error: 'Lỗi tạo hỗ trợ' })
  }
}

export const updateSupport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { ticket_id, user_id, subject, message, status } = req.body
    const support = await prisma.support.update({
      where: { ticket_id: Number(id) },
      data: {
        ticket_id,
        user_id,
        subject,
        message,
        status,
      },
    })
    res.json(support)
  } catch (error) {
    res.status(500).json({ error: 'Lỗi cập nhật hỗ trợ' })
  }
}


