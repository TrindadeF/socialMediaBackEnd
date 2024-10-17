import { Router } from 'express'
import { createUser } from '../controllers/users/createUser'
import { getUser } from '../controllers/users/getUser'
import { deleteUser } from '../controllers/users/deleteUser'
import { authBody } from '../middleware/auth/authBody'
import { updateUser } from '../controllers/users/updateUser'
import { getUserProfile } from '../controllers/users/getUserProfile'
import { uploadSingle } from '../middleware/upload'

const router = Router()

router.post('/register', createUser)
router.post('/login', getUser)
router.get('/profile', authBody, getUserProfile)
router.put('/profile/edit/:id', authBody, uploadSingle, updateUser)
router.delete('/profile/:id', deleteUser)

export default router
