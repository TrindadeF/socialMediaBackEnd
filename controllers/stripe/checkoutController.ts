import {
    generateCheckoutByPlan,
    createPortalCustomer,
    getStripeCustomerByEmail,
} from '../../utils/stripe'
import { Request, Response } from 'express'
import { userModel } from '../../models/users'
import mongoose from 'mongoose'

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

export const checkSubscriptionStatus = async (req: Request, res: Response) => {
    try {
        console.log('Parâmetros recebidos:', req.params)

        const id = req.params.id ? req.params.id.trim() : null
        console.log('ID recebido:', id)

        if (!id) {
            return res
                .status(400)
                .json({ message: 'ID do usuário não fornecido.' })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de usuário inválido.' })
        }

        const user = await userModel.findById(id)
        console.log('Usuário encontrado:', user)

        if (!user) {
            return res.status(404).json({
                message: 'Usuário não encontrado.',
            })
        }

        const hasActiveSubscription = user.stripeSubscriptionStatus === 'active'
        return res.status(200).json({ hasActiveSubscription })
    } catch (error) {
        console.error('Erro ao verificar status da assinatura:', error)
        res.status(500).json({
            error: 'Erro ao verificar status da assinatura.',
        })
    }
}
