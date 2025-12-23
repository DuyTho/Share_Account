import { Router } from 'express'
import { getUserSubscriptions } from '../controllers/subscription.controller'

const router = Router()

router.get('/user/:user_id', getUserSubscriptions)

export default router