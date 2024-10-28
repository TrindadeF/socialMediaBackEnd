import mongoose from 'mongoose'
import { messageSchema } from './message'

export const chatSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    ],
    messages: [messageSchema],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    senderNickName: { type: String, default: '' },
    receiverNickName: { type: String, default: '' },
})
