import { Router } from 'express'
import auth from './auth'
import post from './post'
import checkoutRoute from './checkoutRoute'
import { uploadSingle } from '../middleware/upload'
import stripeRoute from './stripe'
import stripeWebHook from './stripeWebHook'

const router = Router()

router.use('/auth', auth)
router.use('/post', post)
router.use('/checkout', checkoutRoute)
router.use('/upload', uploadSingle)
router.use('/stripe', stripeRoute)
router.use('/stripe-webhook', stripeWebHook)

export default router
