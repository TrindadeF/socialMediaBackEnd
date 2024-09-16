import { Schema } from 'mongoose'
import { Post } from '../database'

export const postSchema = new Schema<Post>({
    content: { type: 'String', required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, required: true, default: 0 },
})
