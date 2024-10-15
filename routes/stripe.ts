import { Router } from 'express'
import {
    createCheckoutSession,
    handleStripeWebhook,
} from '../controllers/stripe'
import express from 'express'

const router = Router()

router.post('/create-checkout-session', createCheckoutSession)

router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    handleStripeWebhook
)

export default router
