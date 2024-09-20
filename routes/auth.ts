import { Router } from 'express'
import { createUser } from '../controllers/users/createUser'
import { getUser } from '../controllers/users/getUser'
import { deleteUser } from '../controllers/users/deleteUser'
import { authBody } from '../middleware/authBody'

const router = Router()

router.get('/login', getUser, authBody)
router.post('/register', createUser)
router.delete('/profile/:id', deleteUser)

export default router
