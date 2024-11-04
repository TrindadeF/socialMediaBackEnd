import { chatModel } from '../../models/chat'
import { Request, Response } from 'express'

export const deleteChat = async (req: Request, res: Response) => {
    const { userId1, userId2 } = req.params
    try {
        const chat = await chatModel.findOneAndDelete({
            participants: { $all: [userId1, userId2], $size: 2 },
        })

        if (!chat) {
            return res
                .status(404)
                .json({ error: 'Chat não encontrado entre os dois usuarios' })
        }

        return res.status(200).json({ message: 'Chat deletado com sucesso' })
    } catch (error) {
        console.error('Erro ao deletar chat:', error)
        return res.status(500).json({ error: 'Error ao deletar chat' })
    }
}
