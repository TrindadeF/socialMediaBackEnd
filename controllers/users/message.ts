import { Request, Response } from 'express'
import { messageModel } from '../../models/message'
import { chatModel } from '../../models/chat'
import { userModel } from '../../models/users'

export const sendMessage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { sender, receiver, content } = req.body

        const senderUser = await userModel.findById(sender).select('nickName')
        const receiverUser = await userModel
            .findById(receiver)
            .select('nickName')

        const newMessage = new messageModel({
            sender,
            receiver,
            content,
            senderNickName: senderUser?.nickName || '',
            receiverNickName: receiverUser?.nickName || '',
        })

        await newMessage.save()

        let chat = await chatModel.findOne({
            participants: { $all: [sender, receiver] },
        })

        if (!chat) {
            chat = new chatModel({
                participants: [sender, receiver],
                messages: [],
                lastMessage: newMessage._id,
                updatedAt: new Date(),
            })
        }

        chat.messages.push(newMessage)
        chat.lastMessage = newMessage._id
        chat.updatedAt = new Date()

        await chat.save()

        res.status(201).json({
            id: newMessage._id,
            sender: newMessage.sender,
            receiver: newMessage.receiver,
            content: newMessage.content,
            timestamp: newMessage.timestamp,
            senderNickName: newMessage.senderNickName,
            receiverNickName: newMessage.receiverNickName,
        })
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error)
        res.status(500).json({ error: 'Erro ao enviar mensagem' })
    }
}

export const getMessages = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { senderId, receiverId } = req.query

        if (!senderId || !receiverId) {
            console.error('Parâmetros inválidos:', { senderId, receiverId })
            res.status(400).json({
                error: 'senderId e receiverId são necessários',
            })
            return
        }

        const chat = await chatModel
            .findOne({ participants: { $all: [senderId, receiverId] } })
            .populate('messages.sender', 'nickName')
            .populate('messages.receiver', 'nickName')
            .exec()

        if (!chat) {
            res.status(404).json({ error: 'Chat não encontrado' })
            return
        }

        const formattedMessages = chat.messages.map((message) => ({
            id: message._id,
            sender: {
                id: message.sender._id,
                nickName: message.senderNickName,
            },
            receiver: {
                id: message.receiver._id,
                nickName: message.receiverNickName,
            },
            content: message.content,
            timestamp: message.timestamp,
        }))

        res.status(200).json(formattedMessages)
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error)
        res.status(500).json({ error: 'Erro ao buscar mensagens' })
    }
}
