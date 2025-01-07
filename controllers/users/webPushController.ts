import { Request, Response } from 'express'
import webPush, { PushSubscription } from 'web-push'
import { SubscriptionModel } from '../../models/subscription'
import { preparePushPayload } from '../../utils/preparePushPayload'

webPush.setVapidDetails(
    'mailto:nakedlove.service@gmail.com',
    'BPwM7KFK1sKJmBYyB3P5O7Iz46xXN1cxR1jyxvvfVjrvPBKR8wAfmvoodu5vh69KkukpNhFle3__5Q4bh505YgU',
    'nAID9cWBIwFFjHkF5x3ybAqh35gpKWArqSpMM2ynntA'
)

export const registerSubscription = async (
    req: Request,
    res: Response
): Promise<void> => {
    const subscription: PushSubscription = req.body

    try {
        await SubscriptionModel.create(subscription)
        res.status(201).json({ message: 'Assinatura registrada com sucesso.' })
    } catch (error) {
        console.error('Erro ao registrar assinatura:', error)
        res.status(500).json({ error: 'Erro ao registrar assinatura.' })
    }
}

export const sendNotifications = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { data } = req.body
    const notifications = preparePushPayload(data)

    try {
        const subscriptions = await SubscriptionModel.find()

        for (const subscription of subscriptions) {
            if (
                subscription.keys &&
                subscription.keys.p256dh &&
                subscription.keys.auth
            ) {
                const pushSubscription: PushSubscription = {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: subscription.keys.p256dh,
                        auth: subscription.keys.auth,
                    },
                }

                for (const notification of notifications) {
                    try {
                        await webPush.sendNotification(
                            pushSubscription,
                            JSON.stringify(notification)
                        )
                        console.log('Notificação enviada:', notification.title)
                    } catch (error: any) {
                        console.error('Erro ao enviar notificação:', error)

                        if (
                            error.statusCode === 410 ||
                            error.statusCode === 404
                        ) {
                            await SubscriptionModel.deleteOne({
                                _id: subscription._id,
                            })
                            console.log(
                                'Assinatura inválida removida:',
                                subscription.endpoint
                            )
                        }
                    }
                }
            }
        }

        res.status(200).json({ message: 'Notificações enviadas com sucesso.' })
    } catch (error) {
        console.error('Erro ao enviar notificações:', error)
        res.status(500).json({ error: 'Erro ao enviar notificações.' })
    }
}
