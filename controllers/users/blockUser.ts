import { Request, Response } from 'express'
import { userModel } from '../../models/users'
import mongoose from 'mongoose'

export const blockUser = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuário não autenticado.' })
        }

        const userId = req.user.id
        const { blockUserId } = req.params

        console.log(`blockUserId recebido: ${blockUserId}`)

        if (!blockUserId || !mongoose.Types.ObjectId.isValid(blockUserId)) {
            return res.status(400).json({ message: 'ID inválido.' })
        }

        const blockUserObjectId = new mongoose.Types.ObjectId(blockUserId)

        const user = await userModel.findById(userId)
        if (!user) {
            return res
                .status(404)
                .json({ message: 'Usuário autenticado não encontrado.' })
        }

        const userToBlock = await userModel.findById(blockUserObjectId)
        if (!userToBlock) {
            return res
                .status(404)
                .json({ message: 'Usuário a ser bloqueado não encontrado.' })
        }

        // Verificar se o usuário já está bloqueado
        if (user.blockedUsers.some((id) => id.toString() === blockUserId)) {
            return res
                .status(400)
                .json({ message: 'Usuário já está bloqueado.' })
        }

        user.blockedUsers.push(blockUserObjectId as any)
        await user.save()

        res.status(200).json({ message: 'Usuário bloqueado com sucesso.' })
    } catch (error: any) {
        console.error('Erro ao bloquear o usuário:', error)
        res.status(500).json({
            message: 'Erro ao bloquear o usuário.',
            error: error.message,
        })
    }
}
