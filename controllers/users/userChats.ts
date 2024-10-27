import { Request, Response } from 'express'
import { chatModel } from '../../models/chat'

export const getChatsByUserId = async (req: Request, res: Response) => {
    const userId = req.params.userId

    try {
        const chats = await chatModel
            .find({ participants: userId })
            .populate('participants', 'name')
            .exec()

        res.json(chats)
    } catch (error) {
        console.error('Erro ao buscar chats:', error)
        res.status(500).json({ message: 'Erro ao buscar chats' })
    }
}
