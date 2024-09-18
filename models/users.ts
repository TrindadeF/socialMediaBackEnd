import { model, Model } from 'mongoose'
import { userSchema } from '../schemas/user'

export const userModel = model('User', userSchema)
