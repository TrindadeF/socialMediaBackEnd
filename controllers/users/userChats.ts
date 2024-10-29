import { Request, Response } from 'express'
import { chatModel } from '../../models/chat'
import { userModel } from '../../models/users'

export const getChatBetweenUsers = async (req: Request, res: Response) => {
    const { userId, otherUserId } = req.params

    try {
        const chat = await chatModel
            .findOne({
                participants: { $all: [userId, otherUserId] },
            })
            .populate({
                path: 'participants',
                select: 'nickName',
                model: userModel,
            })
            .populate({
                path: 'messages',
                select: 'content timestamp',
                populate: [
                    { path: 'sender', select: 'nickName', model: userModel },
                    { path: 'receiver', select: 'nickName', model: userModel },
                ],
            })

        if (!chat) {
            return res.status(404).json({ message: 'Chat não encontrado' })
        }

        const formattedChat = {
            id: chat._id.toString(),
            participants: chat.participants.map((participant) => ({
                id: participant._id.toString(),
                nickName: participant,
            })),
            messages: chat.messages.map((message) => ({
                id: message._id.toString(),
                sender: message.sender
                    ? {
                          id: message.sender._id.toString(),
                          nickName: message.senderNickName,
                      }
                    : null,
                receiver: message.receiver
                    ? {
                          id: message.receiver._id.toString(),
                          nickName: message.receiverNickName,
                      }
                    : null,
                content: message.content,
                timestamp: message.timestamp,
            })),
        }

        res.json(formattedChat)
    } catch (error) {
        console.error('Erro ao buscar chat:', error)
        res.status(500).json({ message: 'Erro ao buscar chat' })
    }
}
