import { Request, Response } from 'express'
import { chatModel } from '../../models/chat'
import { userModel } from '../../models/users'

export const getOrCreateChatByParticipants = async (
    req: Request,
    res: Response
) => {
    const { userId1, userId2 } = req.body

    try {
        let chat = await chatModel
            .findOne({
                participants: { $all: [userId1, userId2] },
            })
            .populate('participants', 'nickname')

        if (!chat) {
            chat = await chatModel.create({
                participants: [userId1, userId2],
                messages: [],
            })
        }

        const participants = await userModel.find(
            {
                _id: { $in: chat.participants },
            },
            'nickname'
        )

        res.status(200).json({
            chatId: chat._id,
            messages: chat.messages,
            participants: participants.map((p) => ({
                id: p._id,
                nickname: p.nickName,
            })),
        })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar ou criar chat', error })
    }
}
