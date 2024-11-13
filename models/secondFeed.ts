import { model } from 'mongoose'
import { secondPost } from '../schemas/secondFeed'

const secondFeed = model('secondFeed', secondPost)

export default secondFeed
