import { Router } from 'express'
import { AuthController } from '../controllers/auth/authController'

const router = Router()
const {} = AuthController

router.post('/login')
router.post('/register')

export default router
