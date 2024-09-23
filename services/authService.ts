import { userModel } from '../models/users'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

export const AuthService = {
    login: async (email: string, password: string) => {
        const user = await userModel.findOne({ email })
        if (!user) throw new Error('Usuário ou senha inválido')

        const match = await bcrypt.compare(password, user.password)
        if (!match) throw new Error('Usuário ou senha inválida')

        const token = jwt.sign(
            { _id: user._id.toString(), name: user.name },
            process.env.SECURITY_KEY,
            { expiresIn: '1h' }
        )
        return token
    },

    register: async (email: string, password: string, name: string) => {
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            throw new Error('Já existe um usuario com este email')
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new userModel({
            email,
            password: hashedPassword,
            name,
        })
        await newUser.save()

        const token = jwt.sign(
            { _id: newUser._id.toString(), name: newUser.name },
            process.env.SECURITY_KEY as string,
            { expiresIn: '7d' }
        )

        return token
    },
}
