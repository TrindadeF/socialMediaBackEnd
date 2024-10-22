import {
    generateCheckoutByPlan,
    createPortalCustomer,
    getStripeCustomerByEmail,
} from '../utils/stripe'
import { Request, Response } from 'express'
import { userModel } from '../models/users'

export const createCheckout = async (req: Request, res: Response) => {
    try {
        const { id, planId } = req.params
        const user = await userModel.findById(id)

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }

        const checkout = await generateCheckoutByPlan(
            user.id,
            user.email,
            planId
        )
        return res.status(200).json({ url: checkout.url })
    } catch (e) {
        console.error('Erro ao criar sessão de checkout:', e)
        return res
            .status(500)
            .json({ error: 'Erro ao criar sessão de checkout' })
    }
}

export const createPortal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id)

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }

        const stripeCustomer = await getStripeCustomerByEmail(user.email)

        if (!stripeCustomer) {
            return res
                .status(404)
                .json({ message: 'Cliente Stripe não encontrado' })
        }

        const portalSession = await createPortalCustomer(stripeCustomer.id)
        return res.status(200).json({ url: portalSession.url })
    } catch (e) {
        console.error('Erro ao criar portal do cliente:', e)
        return res
            .status(500)
            .json({ error: 'Erro ao criar portal do cliente' })
    }
}
