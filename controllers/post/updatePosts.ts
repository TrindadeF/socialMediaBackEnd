import { Request, Response } from 'express'
import PostModel from '../../models/post'

export const updatePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id

        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        )

        if (!updatedPost) {
            return res.status(404).json({ error: 'Post não encontrado' })
        }

        return res.status(200).json(updatedPost)
    } catch (error) {
        console.error('Erro ao atualizar o post:', error)
        return res.status(500).json({ error: 'Erro ao atualizar o post' })
    }
}
