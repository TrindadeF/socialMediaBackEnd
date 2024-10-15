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
    const customer = await getStripeCustomerByEmail(data?.email)
    if (customer) return customer

    return stripe.customers.create({
        email: data.email,
        name: data.name,
    })
}

export const generateCheckout = async (userId: string, email: string) => {
    try {
        const customer = await createStripeCustomer({
            email,
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'multibanco'],
            mode: 'subscription',
            client_reference_id: userId,
            customer: customer.id,
            success_url: `http://localhost:3000/done`,
            cancel_url: `http://localhost:3000/error`,
            line_items: [
                {
                    price: process.env.STRIPE_ID_PLAN,
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

    userExist.stripeCustomerId = stripeCustomerId
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

    userExist.stripeCustomerId = stripeCustomerId
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
        return_url: 'http://localhost:3000/',
    })

    return session
}
