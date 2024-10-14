import { Request, Response } from 'express'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-09-30.acacia',
})

export const createCheckoutSession = async (req: Request, res: Response) => {
    const { priceId } = req.body

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        })

        return res.json({ url: session.url })
    } catch (error) {
        return res
            .status(500)
            .json({ error: 'Erro ao criar a sessão de checkout' })
    }
}

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string

    let event

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET as string
        )
    } catch (err: any) {
        console.error('Erro ao verificar assinatura do webhook:', err)
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session
            console.log(`Pagamento bem-sucedido para a sessão ${session.id}`)
            break
        case 'invoice.payment_succeeded':
            console.log('Pagamento de assinatura bem-sucedido.')
            break
        case 'invoice.payment_failed':
            console.log('Pagamento de assinatura falhou.')
            break
        default:
            console.warn(`Evento não tratado: ${event.type}`)
    }

    res.json({ received: true })
}
