import { Router } from 'express'
import auth from './auth'
import post from './post'

const router = Router()

router.use('/post', post)
router.use('/login', auth)
router.use('/register', auth)

export default router
