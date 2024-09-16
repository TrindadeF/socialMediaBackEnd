import { model } from 'mongoose'
import { postSchema } from '../schemas/post'

export const Post = model('Post', postSchema)
