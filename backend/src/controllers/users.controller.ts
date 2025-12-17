import { Request, Response } from 'express'
import prisma from '../prisma'

// Lấy danh sách user
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany({
      include: {
        Orders: {
          take: 1, // Chỉ lấy 1 đơn hàng
          orderBy: { date: 'desc' }, // Lấy đơn mới nhất
          include: {
            Products: true // Để lấy tên gói (Product Name)
          }
        }
      }
    })
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

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, status } = req.body;
  try {
    const updatedUser = await prisma.users.update({
      where: { user_id: Number(id) },
      data: { name, email, phone, status }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Lỗi cập nhật user" });
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.users.delete({
      where: { user_id: Number(id) }
    });
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: "Không thể xóa user (Có thể do dính líu đến Đơn hàng)" });
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Tìm user trong database bằng email
    const user = await prisma.users.findUnique({
      where: { email: email }
    });

    // 2. Nếu không tìm thấy user
    if (!user) {
      return res.status(400).json({ error: "Email không tồn tại!" });
    }

    // 3. Kiểm tra mật khẩu (Lưu ý: Ở dự án thật phải dùng mã hóa bcrypt, ở đây mình so sánh thô cho dễ hiểu)
    if (user.password !== password) {
      return res.status(400).json({ error: "Mật khẩu không đúng!" });
    }

    // 4. Nếu đúng hết -> Trả về thông tin user (trừ mật khẩu)
    const { password: _, ...userInfo } = user; // Loại bỏ field password ra khỏi kết quả trả về
    res.json({ message: "Đăng nhập thành công", user: userInfo });

  } catch (error) {
    res.status(500).json({ error: "Lỗi hệ thống khi đăng nhập" });
  }
}

