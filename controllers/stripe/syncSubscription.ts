import { stripe } from '../../utils/stripe'
import { userModel } from '../../models/users'

export const syncSubscriptionStatus = async () => {
    try {
        const users = await userModel.find({
            stripeSubscriptionId: { $exists: true },
        })

        for (const user of users) {
            try {
                const subscription = await stripe.subscriptions.retrieve(
                    user.stripeSubscriptionId
                )

                user.stripeSubscriptionStatus = subscription.status
                await user.save()

                console.log(
                    `Usuário ${user._id} atualizado para status: ${subscription.status}`
                )
            } catch (error) {
                console.error(
                    `Erro ao obter status da assinatura para o usuário ${user._id}:`,
                    error
                )
            }
        }
    } catch (error) {
        console.error('Erro ao sincronizar status de assinatura:', error)
    }
}

syncSubscriptionStatus()
