import mongoose from 'mongoose'
import { userSchema } from '../schemas/user'

export const userModel = mongoose.model('User', userSchema)
