import { Router } from 'express'
import { getUsers, createUser, loginUser, updateUser, deleteUser, getUserProfile, updateUserProfile, googleLogin } from '../controllers/users.controller'

const router = Router()

router.get('/', getUsers)
router.post('/', createUser)
router.post('/login', loginUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.get('/:id', getUserProfile)
router.put('/profile/:id', updateUserProfile)
router.post('/google-login', googleLogin)   

export default router