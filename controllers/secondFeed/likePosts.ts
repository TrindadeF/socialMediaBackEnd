import { Response, Request } from 'express'
import mongoose from 'mongoose'
import PostModel from '../../models/secondFeed'

export const likePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuário não autenticado' })
        }

        const userId = new mongoose.Types.ObjectId(req.user.id)

        const post = await PostModel.findById(postId)
        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' })
        }

        if (!Array.isArray(post.likes)) {
            post.likes = []
        }

        const alreadyLiked = post.likes.includes(userId)

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                (id) => id.toString() !== userId.toString()
            )
        } else {
            post.likes.push(userId)
        }

        await post.save()

        return res.status(200).json(post)
    } catch (error) {
        console.error('Erro ao curtir o post:', error)
        return res.status(500).json({ error: 'Erro ao curtir o post' })
    }
}
