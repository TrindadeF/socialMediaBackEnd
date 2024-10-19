import { Schema } from 'mongoose'

export const postSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    media: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
})
