import express, { Request, Response } from 'express'
import Stripe from 'stripe'
import {
    handleCheckoutSessionCompleted,
    handleSubscriptionSessionCompleted,
    handleCancelPlan,
    handleCancelSubscription,
} from '../utils/stripe'
import { userModel } from '../models/users'

const router = express.Router()

const stripe = new Stripe(process.env.STRIPE_SECRET as string)

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

router.post('/cancel-subscription', async (req: Request, res: Response) => {
    try {
        const { subscriptionId } = req.body

        if (!subscriptionId) {
            return res
                .status(400)
                .json({ error: 'Subscription ID is required' })
        }

        const updatedSubscription =
            await handleCancelSubscription(subscriptionId)

        const stripeCustomerId = updatedSubscription.customer as string
        const user = await userModel.findOne({ stripeCustomerId })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        user.stripeSubscriptionStatus = null
        await user.save()

        res.status(200).json({
            success: true,
            subscription: updatedSubscription,
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error canceling subscription:', error.message)
            return res.status(500).json({ error: error.message })
        }

        console.error('Unexpected error:', error)
        return res.status(500).json({ error: 'Unexpected error occurred' })
    }
})

export default router
