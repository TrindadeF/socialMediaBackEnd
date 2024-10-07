import { Request, Response } from 'express'
import { userModel } from '../../models/users'

export const getUserProfile = async (req: Request, res: Response) => {
    const userId = req.user?.id
    try {
        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' })
        }

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar usuário' })
    }
}
