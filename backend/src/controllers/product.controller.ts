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

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params; // Lấy ID từ đường dẫn (URL)
  const { description, price, name } = req.body; // Lấy dữ liệu cần sửa

  try {
    const updatedProduct = await prisma.products.update({
      where: { 
        product_id: Number(id) // Tìm sản phẩm có ID này
      },
      data: {
        // Chỉ cập nhật những trường nào bạn gửi lên, trường nào không gửi giữ nguyên
        ...(description && { description }),
        ...(name && { name }),
        ...(price && { price: Number(price) })
      }
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Không thể cập nhật sản phẩm. Kiểm tra xem ID có tồn tại không?' });
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.products.delete({
      where: { product_id: Number(id) }
    });
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: "Không thể xóa sản phẩm này (có thể do ràng buộc khóa ngoại)" });
  }
}