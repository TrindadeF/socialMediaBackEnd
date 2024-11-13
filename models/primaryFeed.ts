import { model } from 'mongoose'
import { postSchema } from '../schemas/primaryFeed'

const primaryFeed = model('primaryFeed', postSchema)

export default primaryFeed
