import { Request, Response } from 'express'
import prisma from '../prisma'
import { v4 as uuidv4 } from 'uuid';

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

export const getUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: Number(id) },
      // Không trả về password
      select: { user_id: true, name: true, email: true, phone: true, role: true, created_at: true }
    });
    
    if (!user) return res.status(404).json({ error: "Không tìm thấy user" });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, phone } = req.body; // Chỉ cho phép sửa Tên và SĐT

  try {
    const updatedUser = await prisma.users.update({
      where: { user_id: Number(id) },
      data: {
        name: name,
        phone: phone
      }
    });

    // Trả về user mới (để frontend cập nhật localStorage)
    res.json({ 
      message: "Cập nhật thành công", 
      user: {
        user_id: updatedUser.user_id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật thông tin" });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  const { email, name, avatar, google_id } = req.body;

  try {
    // 1. Kiểm tra xem email này đã tồn tại trong Database chưa
    let user = await prisma.users.findUnique({
      where: { email: email }
    });

    if (user) {
      // TRƯỜNG HỢP 1: ĐÃ CÓ TÀI KHOẢN
      // (Có thể update thêm avatar hoặc google_id nếu cần)
      const { password, ...userInfo } = user;
      return res.json({ 
        message: "Đăng nhập Google thành công", 
        user: userInfo 
      });
    } 
    
    // TRƯỜNG HỢP 2: CHƯA CÓ -> TẠO MỚI (Tự động đăng ký)
    // Vì bảng Users yêu cầu password, ta tạo một password ngẫu nhiên siêu khó để không ai đoán được
    // User này sẽ không bao giờ đăng nhập bằng mật khẩu, chỉ dùng Google
    const randomPassword = uuidv4(); 

    const newUser = await prisma.users.create({
      data: {
        email: email,
        name: name || "Google User",
        password: randomPassword, // Password giả để thỏa mãn DB
        phone: "", // Google không trả về sđt, để trống user tự cập nhật sau
        role: "customer",
        status: "active",
        // Nếu DB bạn có trường avatar thì thêm: avatar: avatar
      }
    });

    // Trả về user mới (bỏ password đi)
    const { password: _, ...newUserInfo } = newUser;

    res.json({
      message: "Đăng ký nhanh qua Google thành công",
      user: newUserInfo
    });

  } catch (error) {
    console.error("Lỗi Google Login:", error);
    res.status(500).json({ error: "Lỗi xử lý đăng nhập Google phía server" });
  }
};