import { Router } from 'express'
import { getCart, addToCart, removeFromCart, updateCartItem } from '../controllers/cart.controller'

const router = Router()

// GET /cart/:user_id -> Xem giỏ hàng của user cụ thể
router.get('/:user_id', getCart)

// POST /cart -> Thêm vào giỏ (body: { user_id, product_id })
router.post('/', addToCart)

// DELETE /cart/:id -> Xóa item (id là cart_item_id)
router.delete('/:id', removeFromCart)

// PUT /cart -> Cập nhật số lượng (body: { cart_item_id, quantity })
router.put('/', updateCartItem)

export default router