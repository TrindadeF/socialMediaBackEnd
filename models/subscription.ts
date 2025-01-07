import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema({
    endpoint: { type: String, required: true },
    keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true },
    },
})

export const SubscriptionModel = mongoose.model(
    'Subscription',
    subscriptionSchema
)

module.exports = { SubscriptionModel }
