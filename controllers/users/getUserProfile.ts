import { Request, Response } from 'express'
import { userModel } from '../../models/users'
import mongoose from 'mongoose'

export const getUserProfile = async (req: Request, res: Response) => {
    const userId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'ID inválido' })
    }

    try {
        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' })
        }

        return res.status(200).json(user)
    } catch (error) {
        console.error('Erro ao buscar usuário:', error)
        return res.status(500).json({ error: 'Erro ao buscar usuário' })
    }
}
