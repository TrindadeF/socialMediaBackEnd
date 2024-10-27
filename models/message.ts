import { model } from 'mongoose'
import { messageSchema } from '../schemas/message'

export const messageModel = model('message', messageSchema)
