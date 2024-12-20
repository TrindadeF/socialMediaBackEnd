import mongoose from 'mongoose'
import { messageSchema } from './message'

export const chatSchema = new mongoose.Schema({
    participants: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            isAnonymous: {
                type: Boolean,
                default: false, // Define o anonimato como false por padrão
            },
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

