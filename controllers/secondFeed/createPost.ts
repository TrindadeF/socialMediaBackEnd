import { Response, Request } from 'express'
import PostModel from '../../models/secondFeed'
import { FileWithLocation } from '../../types'

export const createPost = async (req: Request, res: Response) => {
    try {
        const { content } = req.body

        if (!req.user || !req.user.id) {
            return res
                .status(401)
                .json({ error: 'Usuário não autenticado ou ID ausente' })
        }

        const isContentValid =
            content && typeof content === 'string' && content.trim().length > 0

        const file = req.file as FileWithLocation
        const mediaUrl = file ? file.location : null

        if (!isContentValid && !mediaUrl) {
            return res.status(400).json({
                error: 'É necessário fornecer um conteúdo ou uma imagem para criar o post',
            })
        }

        const post = await PostModel.create({
            content: isContentValid ? content.trim() : undefined,
            owner: req.user.id,
            media: mediaUrl ? [mediaUrl] : [],
            createdAt: new Date(),
            likes: [],
            comments: [],
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
