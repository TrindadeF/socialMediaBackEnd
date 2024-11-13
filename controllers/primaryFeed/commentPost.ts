import { Request, Response } from 'express'
import primaryFeed from '../../models/primaryFeed'
import { commentsModel } from '../../models/comments'
import { ObjectId } from 'mongoose'

export const addComment = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params
        const { content } = req.body

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuário não autenticado' })
        }

        if (
            !content ||
            typeof content !== 'string' ||
            content.trim().length === 0
        ) {
            return res
                .status(400)
                .json({ error: 'Conteúdo do comentário ausente ou inválido' })
        }

        const newComment = await commentsModel.create({
            content: content.trim(),
            owner: req.user.id,
            createdAt: new Date(),
            postId,
        })

        const post = await primaryFeed.findByIdAndUpdate(
            postId,
            { $push: { comments: newComment._id as unknown as ObjectId } },
            { new: true }
        )

        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' })
        }

        return res.status(201).json({
            message: 'Comentário adicionado com sucesso',
            comment: newComment,
        })
    } catch (error: any) {
        console.error('Erro ao adicionar comentário:', error)
        return res
            .status(500)
            .json({ error: error.message || 'Erro ao adicionar comentário' })
    }
}
