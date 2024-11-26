import Stripe from 'stripe'
import { userModel } from '../models/users'

export const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
    httpClient: Stripe.createFetchHttpClient(),
})

export const getStripeCustomerByEmail = async (email: string) => {
    const customers = await stripe.customers.list({ email })
    return customers.data[0]
}

export const createStripeCustomer = async (data: {
    email: string
    name?: string
}) => {
    const customer = await getStripeCustomerByEmail(data.email)
    if (customer) return customer

    return stripe.customers.create({
        email: data.email,
        name: data.name,
    })
}

export const generateCheckoutByPlan = async (
    userId: string,
    email: string,
    planId: string
) => {
    try {
        const customer = await createStripeCustomer({ email })

        const user = await userModel.findById(userId)
        if (user && !user.stripeCustomerId) {
            user.stripeCustomerId = customer.id
            await user.save()
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            client_reference_id: userId,
            customer: customer.id,
            success_url: `https://nakedlove.eu/api/payments`,
            cancel_url: `https://nakedlove.eu/api/payments`,
            line_items: [
                {
                    price: planId,
                    quantity: 1,
                },
            ],
        })

        return {
            url: session.url,
        }
    } catch (error) {
        console.log('Error generating checkout session', error)
        throw error
    }
}

export const handleCheckoutSessionCompleted = async (event: {
    data: { object: Stripe.Checkout.Session }
}) => {
    const idUser = event.data.object.client_reference_id as string
    const stripeSubscriptionId = event.data.object.subscription as string
    const stripeCustomerId = event.data.object.customer as string
    const checkoutStatus = event.data.object.status

    if (checkoutStatus !== 'complete') return

    if (!idUser || !stripeSubscriptionId || !stripeCustomerId) {
        throw new Error(
            'idUser, stripeSubscriptionId, stripeCustomerId are required'
        )
    }

    const userExist = await userModel.findById(idUser)

    if (!userExist) {
        throw new Error('User not found')
    }

    userExist.stripeCustomerId = stripeCustomerId
    userExist.stripeSubscriptionId = stripeSubscriptionId
    await userExist.save()
}

export const handleSubscriptionSessionCompleted = async (event: {
    data: { object: Stripe.Subscription }
}) => {
    const subscriptionStatus = event.data.object.status
    const stripeCustomerId = event.data.object.customer as string
    const stripeSubscriptionId = event.data.object.id as string

    const userExist = await userModel.findOne({ stripeCustomerId })

    if (!userExist) {
        throw new Error('User with stripeCustomerId not found')
    }

    userExist.stripeSubscriptionId = stripeSubscriptionId
    userExist.stripeSubscriptionStatus = subscriptionStatus
    await userExist.save()
}

export const handleCancelPlan = async (event: {
    data: { object: Stripe.Subscription }
}) => {
    const stripeCustomerId = event.data.object.customer as string

    const userExist = await userModel.findOne({ stripeCustomerId })

    if (!userExist) {
        throw new Error('User with stripeCustomerId not found')
    }

    userExist.stripeSubscriptionStatus = null
    await userExist.save()
}

export const handleCancelSubscription = async (idSubscriptions: string) => {
    const subscription = await stripe.subscriptions.update(idSubscriptions, {
        cancel_at_period_end: true,
    })

    return subscription
}

export const createPortalCustomer = async (idCustomer: string) => {
    const session = await stripe.billingPortal.sessions.create({
        customer: idCustomer,
        return_url: 'https://nakedlove.eu/api/payments',
    })

    return session
}

const handleSubscriptionStatus = async (event: Stripe.Event) => {
    const subscription = event.data.object as Stripe.Subscription

    const stripeCustomerId = subscription.customer as string
    const subscriptionId = subscription.id
    const status = subscription.status

    console.log(
        `Evento recebido: ${event.type}. Status da assinatura: ${status}`
    )

    try {
        const user = await userModel.findOne({ stripeCustomerId })

        if (!user) {
            console.error(
                `Usuário não encontrado para Stripe Customer ID: ${stripeCustomerId}`
            )
            return
        }

        user.stripeSubscriptionId = subscriptionId
        user.stripeSubscriptionStatus = status
        await user.save()

        console.log(
            `Status da assinatura atualizado para o usuário: ${user.email} - Status: ${status}`
        )
    } catch (error) {
        console.error('Erro ao processar o evento de assinatura:', error)
    }
}
