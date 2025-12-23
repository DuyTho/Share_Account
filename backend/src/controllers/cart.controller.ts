import { Request, Response } from 'express'
import prisma from '../prisma'

// 1. Lấy danh sách giỏ hàng của User
export const getCart = async (req: Request, res: Response) => {
  const { user_id } = req.params 

  try {
    const cartItems = await prisma.cartItems.findMany({
      where: { user_id: Number(user_id) },
      include: {
        Products: true // Lấy luôn thông tin sản phẩm (Tên, giá, hình ảnh...)
      }
    })
    res.json(cartItems)
  } catch (error) {
    res.status(500).json({ error: "Lỗi lấy giỏ hàng" })
  }
}

// 2. Thêm sản phẩm vào giỏ
export const addToCart = async (req: Request, res: Response) => {
  const { user_id, product_id } = req.body

  try {
    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingItem = await prisma.cartItems.findFirst({
      where: {
        user_id: Number(user_id),
        product_id: Number(product_id)
      }
    })

    if (existingItem) {
      // Nếu có rồi -> Tăng số lượng lên 1
      // (Với web bán account thường chỉ mua 1, nhưng cứ làm logic này cho chuẩn)
      const updatedItem = await prisma.cartItems.update({
        where: { cart_item_id: existingItem.cart_item_id },
        data: { quantity: existingItem.quantity + 1 }
      })
      return res.json({ message: "Đã cập nhật số lượng", data: updatedItem })
    }

    // Nếu chưa có -> Tạo mới
    const newItem = await prisma.cartItems.create({
      data: {
        user_id: Number(user_id),
        product_id: Number(product_id),
        quantity: 1
      }
    })
    res.json({ message: "Đã thêm vào giỏ hàng", data: newItem })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Lỗi thêm vào giỏ hàng" })
  }
}

// 3. Xóa sản phẩm khỏi giỏ
export const removeFromCart = async (req: Request, res: Response) => {
  const { id } = req.params // id này là cart_item_id

  try {
    await prisma.cartItems.delete({
      where: { cart_item_id: Number(id) }
    })
    res.json({ message: "Đã xóa sản phẩm khỏi giỏ" })
  } catch (error) {
    res.status(500).json({ error: "Lỗi xóa sản phẩm" })
  }
}

// 4. Cập nhật số lượng sản phẩm trong giỏ
export const updateCartItem = async (req: Request, res: Response) => {
  const { cart_item_id, quantity } = req.body;

  try {
    if (quantity < 1) {
      return res.status(400).json({ error: "Số lượng phải ít nhất là 1" });
    }

    const updatedItem = await prisma.cartItems.update({
      where: { cart_item_id: Number(cart_item_id) },
      data: { quantity: Number(quantity) }
    });

    res.json({ message: "Cập nhật thành công", data: updatedItem });
  } catch (error) {
    res.status(500).json({ error: "Lỗi cập nhật giỏ hàng" });
  }
}