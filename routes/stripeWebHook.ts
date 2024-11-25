import express, { Request, Response } from 'express'
import Stripe from 'stripe'
import {
    handleCheckoutSessionCompleted,
    handleSubscriptionSessionCompleted,
    handleCancelPlan,
} from '../utils/stripe'

const router = express.Router()

const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
    apiVersion: '2024-09-30.acacia',
})

router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    async (req: Request, res: Response) => {
        const sig = req.headers['stripe-signature']
        let event

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig as string,
                process.env.STRIPE_WEBHOOK_SECRET as string
            )
        } catch (err: any) {
            console.error('Erro ao validar o webhook:', err.message)
            return res.status(400).send(`Webhook Error: ${err.message}`)
        }

        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event)
                break
            case 'customer.subscription.updated':
                await handleSubscriptionSessionCompleted(event)
                break
            case 'customer.subscription.deleted':
                await handleCancelPlan(event)
                break
            default:
                console.log(`Evento não tratado: ${event.type}`)
        }

        res.json({ received: true })
    }
)

export default router
