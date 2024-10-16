import { Request, Response } from 'express'
import { userModel } from '../../models/users'
import { User } from '../../database'
import bcrypt from 'bcrypt'

export const createUser = async (req: Request, res: Response) => {
    const {
        name,
        age,
        gender,
        email,
        password,
        description,
        nickName,
        stripeCustomerId,
        stripeSubscriptionId,
        stripeSubscriptionStatus,
    }: User = req.body

    try {
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await userModel.create({
            name,
            age,
            gender,
            email,
            password: hashedPassword,
            confirmpassword: hashedPassword,
            description,
            nickName,
            stripeCustomerId,
            stripeSubscriptionId,
            stripeSubscriptionStatus,
        })

        return res
            .status(201)
            .json({ message: 'Usuário criado com sucesso', user: newUser })
    } catch (error: any) {
        return res
            .status(400)
            .json({ error: error.message || 'Erro ao criar usuário' })
    }
}
