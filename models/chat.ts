import { chatSchema } from '../schemas/chat'
import { model, Model } from 'mongoose'

export const chatModel = model('chat', chatSchema)
