import { Router, Request, Response } from 'express'
import {
    handleCheckoutSessionCompleted,
    handleCancelPlan,
} from '../utils/stripe'
import Stripe from 'stripe'
import express from 'express'
import { userModel } from '../models/users'

const router = Router()
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
            console.error('Webhook signature verification failed.', err)
            return res.status(400).send(`Webhook Error: ${err.message}`)
        }

        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event)
                break
            case 'invoice.payment_succeeded':
                const invoice = event.data.object as Stripe.Invoice
                const customerId = invoice.customer as string
                const subscriptionId = invoice.subscription as string

                const userExist = await userModel.findOne({
                    stripeCustomerId: customerId,
                })

                if (!userExist) {
                    console.error('User not found for customerId', customerId)
                    return res.status(400).send('User not found')
                }

                userExist.stripeSubscriptionId = subscriptionId
                userExist.stripeSubscriptionStatus = 'active'
                await userExist.save()

                console.log(
                    'Invoice paid successfully, user subscription updated'
                )
                break

            case 'customer.subscription.deleted':
                await handleCancelPlan(event)
                break
            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        res.json({ received: true })
    }
)

export default router
