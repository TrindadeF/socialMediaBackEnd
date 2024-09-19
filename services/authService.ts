import { userModel } from '../models/users'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const AuthService = {
    login: async (email: string, password: string) => {
        const user = await userModel.findOne({ email })
        if (!user) throw new Error('Usuario ou senha invalido')
        const match = bcrypt.compare(password, user.password)
        if (!match) throw new Error('Usuario ou senha invalida')
        const securityKey = process.env.SECURITY_KEY
        const token = jwt.sign(
            { _id: user._id.toString(), name: user.name },
            securityKey,
            { expiresIn: '1h' }
        )
        return token
    },

    //register: async (email: string, password: string): Promise<any> => {
    //    return { email, password }
    //},
}
