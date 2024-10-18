import { Response, Request } from 'express'
import PostModel from '../../models/post'

export const createPost = async (req: Request, res: Response) => {
    try {
        const { content } = req.body

        if (!req.user || !req.user.id) {
            console.log('Usuário não autenticado ou ID ausente')
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

        const mediaUrls = req.body.mediaUrls || []

        if (mediaUrls.length === 0) {
            console.log('Nenhuma mídia foi enviada')
        }

        const post = await PostModel.create({
            content: content.trim(),
            owner: req.user.id,
            media: mediaUrls,
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
