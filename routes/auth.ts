import { Router } from 'express'
import { createUser } from '../controllers/users/createUser'
import { getUser } from '../controllers/users/getUser'
import { deleteUser } from '../controllers/users/deleteUser'
import { authBody } from '../middleware/auth/authBody'
import { updateUser } from '../controllers/users/updateUser'
import { getUserProfile } from '../controllers/users/getUserProfile'

const router = Router()

router.post('/register', createUser)
router.post('/login', getUser)
router.get('/profile/:id', authBody, getUserProfile)
router.put('/profile', authBody, updateUser)
router.delete('/profile/:id', deleteUser)

export default router
