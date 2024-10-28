import { Request, Response } from 'express'
import { chatModel } from '../../models/chat'
import { userModel } from '../../models/users'

export const getChatsByUserId = async (req: Request, res: Response) => {
    const userId = req.params.userId

    try {
        const chats = await chatModel
            .find({ participants: userId })
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

        const formattedChats = chats.map((chat) => ({
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
        }))

        res.json(formattedChats)
    } catch (error) {
        console.error('Erro ao buscar chats:', error)
        res.status(500).json({ message: 'Erro ao buscar chats' })
    }
}
