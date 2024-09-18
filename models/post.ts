import { model } from 'mongoose'
import { postSchema } from '../schemas/post'

const Post = model('Post', postSchema)

export default Post
