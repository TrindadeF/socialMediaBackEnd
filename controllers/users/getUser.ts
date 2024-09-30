import { Request, Response } from 'express'
import { userModel } from '../../models/users'
import bcrypt from 'bcrypt'

export const getUser = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ error: 'Email não encontrado' })
        }

        console.log(`Senha fornecida: ${password}`)
        console.log(`Senha armazenada: ${user.password}`)

        const isPasswordValid = await bcrypt.compare(password, user.password)
        console.log(`Senha válida: ${isPasswordValid}`)

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Senha incorreta' })
        }

        return res.status(200).json({
            message: 'Login bem-sucedido',
            user: { id: user._id, name: user.name, email: user.email },
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message })
        }
        return res.status(400).json({ error: 'Erro ao fazer login' })
    }
}
