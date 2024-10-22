import { Router } from 'express'
import auth from './auth'
import checkoutRoute from './checkoutRoute'
import { uploadSingle } from '../middleware/upload'
import stripeRoute from './stripe'
import stripeWebHook from './stripeWebHook'
import primaryFeed from './primaryFeed'
import secondFeed from './secondFeed'
import { forgotPassword } from '../controllers/users/resetPassword'

const router = Router()

router.use('/auth', auth)
router.use('/primaryFeed', primaryFeed)
router.use('/checkout', checkoutRoute)
router.use('/upload', uploadSingle)
router.use('/stripe', stripeRoute)
router.use('/stripe-webhook', stripeWebHook)
router.use('/secondFeed', secondFeed)
router.post('/reset-password', forgotPassword)

export default router
