import { Router } from 'express'
import { getSupport, createSupport, updateSupport, getSupportById } from '../controllers/support.controller'

const router = Router()

router.get('/', getSupport)
router.post('/', createSupport)
router.put('/:id', updateSupport)
router.get('/:id', getSupportById)

export default router