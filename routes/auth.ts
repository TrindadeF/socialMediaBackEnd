import { Router } from 'express'
import { createUser } from '../controllers/users/createUser'
import { getUser } from '../controllers/users/getUser'
import { deleteUser } from '../controllers/users/deleteUser'
import { authBody } from '../middleware/auth/authBody'
import { updateUser } from '../controllers/users/updateUser'

const router = Router()

router.get('/login', getUser, authBody)
router.post('/register', createUser)

router.get('/profile', authBody, getUser)
router.put('/profile', authBody, updateUser)
router.delete('/profile', authBody, deleteUser)

export default router
