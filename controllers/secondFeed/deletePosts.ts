import { Request, Response } from 'express'
import PostModel from '../../models/secondFeed'

export const deletePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.postid
        console.log('ID recebido para exclusão:', postId)

        const post = await PostModel.findByIdAndDelete(postId)
        console.log('Resultado da exclusão:', post)

        if (!post) {
            console.warn('Post não encontrado')
            return res.status(404).json({ error: 'Post não encontrado' })
        }

        console.log('Post deletado com sucesso')
        return res.status(200).json({ message: 'Post deletado com sucesso' })
    } catch (error) {
        console.error('Erro ao deletar o post:', error)
        return res.status(500).json({ error: 'Erro ao deletar o post' })
    }
}
