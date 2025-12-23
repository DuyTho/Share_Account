import { Router } from 'express'
import { getOrders, createOrder, getUserOrders, checkout, updateOrderStatus, deleteOrder } from '../controllers/order.controller'

const router = Router()

router.get('/', getOrders)
router.get('/user/:user_id', getUserOrders)
router.post('/', createOrder)
router.post('/checkout', checkout)
router.put('/:id/status', updateOrderStatus)
router.delete('/:id', deleteOrder)

export default router