import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { commentsModel } from '../../models/comments'
import secondFeed from '../../models/secondFeed'

export const deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params

    try {
        const commentObjectId = new mongoose.Types.ObjectId(commentId)

        const comment = await commentsModel.findById(commentObjectId)
        if (!comment) {
            return res.status(404).json({ error: 'Comentário não encontrado' })
        }

        const post = await secondFeed.findById(comment.postId)
        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' })
        }
        await commentsModel.findByIdAndDelete(commentObjectId)

        await secondFeed.findByIdAndUpdate(comment.postId, {
            $pull: { comments: commentObjectId },
        })

        return res
            .status(200)
            .json({ message: 'Comentário apagado com sucesso' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Erro ao apagar o comentário' })
    }
}
