import { Request, Response } from 'express'
import { stripe } from '../../utils/stripe'
import { userModel } from '../../models/users'

export const cancelSubscription = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params

        if (!userId) {
            return res
                .status(400)
                .json({ message: 'ID do usuário não fornecido.' })
        }

        const user = await userModel.findById(userId)
        if (!user || !user.stripeSubscriptionId) {
            return res
                .status(404)
                .json({ message: 'Usuário ou assinatura não encontrado.' })
        }

        const canceledSubscription = await stripe.subscriptions.update(
            user.stripeSubscriptionId,
            {
                cancel_at_period_end: true,
            }
        )

        user.stripeSubscriptionStatus = 'canceled'
        await user.save()

        return res.status(200).json({
            message: 'Assinatura cancelada com sucesso.',
            subscription: canceledSubscription,
        })
    } catch (error) {
        console.error('Erro ao cancelar assinatura:', error)
        res.status(500).json({ message: 'Erro ao cancelar assinatura.' })
    }
}
