import mongoose, { Schema } from 'mongoose'

export const secondPost = new Schema({
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
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],

    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
})
