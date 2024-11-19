import { Request, Response } from 'express'
import { userModel } from '../../models/users'
import primaryFeed from '../../models/primaryFeed'
import secondFeed from '../../models/secondFeed'

export const getUsersWhoLikedPost = async (req: Request, res: Response) => {
    const { postId } = req.params

    try {
        let post = await primaryFeed.findById(postId).populate<{
            likes: { name: string; profilePic: string }[]
        }>('likes', 'name profilePic')

        if (!post) {
            post = await secondFeed.findById(postId).populate<{
                likes: { name: string; profilePic: string }[]
            }>('likes', 'name profilePic')
        }

        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado' })
        }

        res.json({
            content: post.content,
            likes: post.likes.map((user) => ({
                name: user.name,
                profilePic: user.profilePic,
            })),
        })
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar usuários que deram like no post',
            error,
        })
    }
}

export const getUsersWhoLikedProfile = async (req: Request, res: Response) => {
    const { userId } = req.params

    try {
        const user = await userModel
            .findById(userId)
            .populate('likes', 'name profilePic')

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }

        res.json(user.likes)
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar usuários que deram like no perfil',
            error,
        })
    }
}
