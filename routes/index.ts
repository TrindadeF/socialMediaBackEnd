import { Router } from 'express'
import auth from './auth'
import checkoutRoute from './checkoutRoute'
import { uploadSingle } from '../middleware/upload'
import stripeRoute from './stripe'
import stripeWebHook from './stripeWebHook'
import primaryFeed from './primaryFeed'
import secondFeed from './secondFeed'
import {forgotPassword, resetPassword,} from '../controllers/users/resetPassword'
import { getAllUsersWithPosts } from '../controllers/users/getAllusers'
import { getUserProfile } from '../controllers/users/getUserProfile'
import { syncSubscriptionStatus } from '../controllers/stripe/syncSubscription'
import { cancelSubscription } from '../controllers/stripe/cancelSubscription'

const router = Router()

router.use('/api/auth', auth)
router.use('/api/primaryFeed', primaryFeed)
router.use('/api/checkout', checkoutRoute)
router.use('/api/upload', uploadSingle)
router.use('/api/stripe', stripeRoute)
router.use('/api/stripe-webhook', stripeWebHook)
router.use('/api/secondFeed', secondFeed)
router.post('/api/reset-password', forgotPassword)
router.post('/api/reset-password/:token', resetPassword)
router.get('/api/users', getAllUsersWithPosts)
router.get('/api/users/:id', getUserProfile)
router.post('/api/admin/sync-subscrition-status', syncSubscriptionStatus)
router.delete('/api/cancel-subscription/:userId', cancelSubscription)

export default router
