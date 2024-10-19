import { Response, Request } from 'express'
import PostModel from '../../models/post'
import { FileWithLocation } from '../../types'

export const createPost = async (req: Request, res: Response) => {
    try {
        const { content } = req.body

        if (!req.user || !req.user.id) {
            return res
                .status(401)
                .json({ error: 'Usuário não autenticado ou ID ausente' })
        }

        if (
            !content ||
            typeof content !== 'string' ||
            content.trim().length === 0
        ) {
            return res
                .status(400)
                .json({ error: 'Conteúdo do post ausente ou inválido' })
        }

        const file = req.file as FileWithLocation
        const mediaUrl = file ? file.location : null

        if (!mediaUrl) {
            console.log('Nenhuma mídia foi enviada')
        } else {
            console.log('Mídia enviada:', mediaUrl)
        }

        const post = await PostModel.create({
            content: content.trim(),
            owner: req.user.id,
            media: mediaUrl ? [mediaUrl] : [],
            createdAt: new Date(),
            likes: 0,
        })

        return res
            .status(201)
            .json({ message: 'Post criado com sucesso', post })
    } catch (error: any) {
        console.error('Erro ao criar o post:', error)
        return res
            .status(500)
            .json({ error: error.message || 'Erro ao criar o post' })
    }
}
