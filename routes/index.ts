import { Router } from 'express'
import auth from './auth'
import checkoutRoute from './checkoutRoute'
import { uploadSingle } from '../middleware/upload'
import stripeRoute from './stripe'
import stripeWebHook from './stripeWebHook'
import primaryFeed from './primaryFeed'
import secondFeed from './secondFeed'
import { forgotPassword } from '../controllers/users/resetPassword'
import { getAllUsers } from '../controllers/users/getAllusers'
import { getUserProfile } from '../controllers/users/getUserProfile'
import { syncSubscriptionStatus } from '../controllers/syncSubscription'

const router = Router()

router.use('/api/auth', auth)
router.use('/api/primaryFeed', primaryFeed)
router.use('/api/checkout', checkoutRoute)
router.use('/api/upload', uploadSingle)
router.use('/api/stripe', stripeRoute)
router.use('/api/stripe-webhook', stripeWebHook)
router.use('/api/secondFeed', secondFeed)
router.post('/api/reset-password', forgotPassword)
router.get('/api/users', getAllUsers)
router.get('/api/users/:id', getUserProfile)
router.post('/api/admin/sync-subscrition-status', syncSubscriptionStatus)

export default router
