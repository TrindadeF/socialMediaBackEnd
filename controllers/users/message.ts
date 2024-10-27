import { Request, Response } from 'express'
import { messageModel } from '../../models/message'

export const sendMessage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { sender, receiver, content } = req.body

        const newMessage = new messageModel({
            sender,
            receiver,
            content,
        })

        await newMessage.save()
        res.status(201).json(newMessage)
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

        const messages = await messageModel
            .find({
                $or: [
                    { sender: senderId, receiver: receiverId },
                    { sender: receiverId, receiver: senderId },
                ],
            })
            .sort({ timestamp: 1 })
            .select('content sender timestamp')

        const formattedMessages = messages.map((message) => ({
            id: message._id,
            sender: message.sender,
            receiver: message.receiver,
            content: message.content,
            timestamp: message.timestamp,
        }))

        res.status(200).json(formattedMessages)
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error)
        res.status(500).json({ error: 'Erro ao buscar mensagens' })
    }
}
