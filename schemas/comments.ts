import mongoose, { mongo, Mongoose } from 'mongoose'

export const commentSchema = new mongoose.Schema({
    content: { type: 'String', required: true },
    createdAt: { type: Date, default: Date.now },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
})
