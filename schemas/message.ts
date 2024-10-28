import mongoose from 'mongoose'

export const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    senderNickName: { type: String },
    receiverNickName: { type: String },
})
