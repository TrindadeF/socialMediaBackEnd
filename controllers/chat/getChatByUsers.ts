import { Request, Response } from 'express'
import { chatModel } from '../../models/chat'

export const getChatByUsers = async (req: Request, res: Response) => {
    const { userId1, userId2 } = req.params

    try {
        const chat = await chatModel
            .findOne({
                participants: { $all: [userId1, userId2] },
            })
            .populate('participants', 'nickName')

        if (!chat) {
            return res.status(404).json({ message: 'Chat não encontrado' })
        }

        res.status(200).json(chat)
    } catch (error) {
        console.error('Erro ao buscar chat:', error)
        res.status(500).json({ message: 'Erro ao buscar chat', error })
    }
}

export const getChatsByUserId = async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Usuário não autenticado' })
    }

    const userId = req.user.id

    try {
        const chats = await chatModel
            .find({
                participants: userId,
            })
            .populate('participants', 'nickName')

        if (!chats || chats.length === 0) {
            return res.status(404).json({ message: 'Nenhum chat encontrado' })
        }

        return res.status(200).json(chats)
    } catch (error) {
        console.error('Erro ao buscar chats:', error)
        return res.status(500).json({ message: 'Erro ao buscar chats.' })
    }
}
