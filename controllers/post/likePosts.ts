import { Request, Response } from 'express'
import mongoose from 'mongoose'
import PostModel from '../../models/post'

export const likePost = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuário não autenticado' })
        }

        const userId = req.user.id
        const postId = req.params.postId

        const post = await PostModel.findById(postId)
        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' })
        }

        if (post.likes.includes(new mongoose.Types.ObjectId(userId))) {
            return res.status(400).json({ error: 'Você já curtiu este post' })
        }

        post.likes.push(new mongoose.Types.ObjectId(userId))
        await post.save()

        return res.status(200).json({ message: 'Post curtido com sucesso!' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Erro ao curtir o post' })
    }
}
