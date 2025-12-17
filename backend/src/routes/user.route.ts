import { Router } from 'express'
import { getUsers, createUser, loginUser, updateUser, deleteUser } from '../controllers/users.controller'

const router = Router()

router.get('/', getUsers)
router.post('/', createUser)
router.post('/login', loginUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router