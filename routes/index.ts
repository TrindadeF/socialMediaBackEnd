import { Router } from 'express'
import auth from './auth'
import post from './post'
import checkoutRoute from './checkoutRoute'
import { uploadSingle } from '../middleware/upload'

const router = Router()

router.use('/auth', auth)
router.use('/post', post)
router.use('/checkout', checkoutRoute)
router.use('/upload', uploadSingle)

export default router
