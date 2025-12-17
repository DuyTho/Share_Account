import { Request, Response } from 'express'
import prisma from '../prisma'

export const getSupport = async (req: Request, res: Response) => {
  try {
    const supports = await prisma.support.findMany({
      orderBy: { ticket_id: 'asc' }, 
      include: {
        Users: { 
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })
    res.json(supports)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Lỗi lấy danh sách ticket" })
  }
}

export const getSupportById = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const supports = await prisma.support.findUnique({
      where: { ticket_id: Number(id) },
      include: {
        Users: {
          select: { name: true, email: true }
        }
      }
    })

    if (!supports) {
      return res.status(404).json({ error: "Không tìm thấy ticket này" })
    }

    res.json(supports)
  } catch (error) {
    res.status(500).json({ error: "Lỗi lấy thông tin ticket" })
  }
}

export const createSupport = async (req: Request, res: Response) => {
  const { user_id, subject, message } = req.body

  try {
    const newSupport = await prisma.support.create({
      data: {
        user_id: Number(user_id),
        subject: subject,
        message: message,
        status: 'new' 
      }
    })
    res.status(201).json({
      message: "Gửi yêu cầu hỗ trợ thành công",
      data: newSupport
    })

  } catch (error) {
    console.error("Lỗi tạo hỗ trợ:", error)
    res.status(500).json({ error: "Không thể gửi yêu cầu hỗ trợ" })
  }
}

export const updateSupport = async (req: Request, res: Response) => {
  const { id } = req.params
  const { status, message } = req.body 

  try {
    const updatedSupport = await prisma.support.update({
      where: { ticket_id: Number(id) },
      data: {
        ...(status && { status: status }), 
        ...(message && { message: message })
      }
    })

    res.json({
      message: "Cập nhật thành công",
      data: updatedSupport
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Không thể cập nhật (Có thể ID không tồn tại)" })
  }
}


