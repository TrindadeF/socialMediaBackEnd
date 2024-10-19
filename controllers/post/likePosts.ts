import { Response, Request } from 'express'
import PostModel from '../../models/post'

export const likePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuário não autenticado' })
        }

        const post = await PostModel.findById(postId)
        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' })
        }

        return res.status(200).json(post)
    } catch (error) {
        console.error('Erro ao curtir o post:', error)
        return res.status(500).json({ error: 'Erro ao curtir o post' })
    }
}
