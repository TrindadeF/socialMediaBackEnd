import { Request, Response } from 'express'
import PostModel from '../../models/primaryFeed'

export const deletePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id

        const post = await PostModel.findByIdAndDelete(postId)
        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' })
        }

        return res.status(200).json({ message: 'Post deletado com sucesso' })
    } catch (error) {
        console.error('Erro ao deletar o post:', error)
        return res.status(500).json({ error: 'Erro ao deletar o post' })
    }
}
