import { Request, Response } from 'express'
import { userModel } from '../../models/users'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const getUser = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Senha incorreta' })
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECURITY_KEY,
            { expiresIn: '7d' }
        )
        console.log('Token gerado:', token)

        return res.status(200).json({ message: 'Login bem-sucedido', token })
    } catch (error) {
        return res.status(500).json({ error: 'Erro no servidor' })
    }
}
