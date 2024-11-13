import mongoose, { Model } from 'mongoose'
import { commentSchema } from '../schemas/comments'

export const commentsModel = mongoose.model('Comment', commentSchema)
