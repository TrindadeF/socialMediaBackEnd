import { Request, Response } from 'express'
import { userModel } from '../../models/users'
import primaryFeed from '../../models/primaryFeed'
import secondFeed from '../../models/secondFeed'

export const getNotifications = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const userId = req.params.userId

        const user = await userModel.findById(userId).lean()
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }

        const primaryPosts = await primaryFeed.find({ owner: userId }).lean()
        const likesOnPrimaryPosts = await Promise.all(
            primaryPosts.map(async (post) => {
                const usersWhoLiked = await userModel
                    .find({ _id: { $in: post.likes } })
                    .select('_id name profilePic')
                    .lean()
                return {
                    postId: post._id,
                    content: post.content,
                    likedBy: usersWhoLiked,
                }
            })
        )

        const secondPosts = await secondFeed.find({ owner: userId }).lean()
        const likesOnSecondPosts = await Promise.all(
            secondPosts.map(async (post) => {
                const usersWhoLiked = await userModel
                    .find({ _id: { $in: post.likes } })
                    .select('_id name profilePic')
                    .lean()
                return {
                    postId: post._id,
                    content: post.content,
                    likedBy: usersWhoLiked,
                }
            })
        )

        const profileLikes = await userModel
            .find({ _id: { $in: user.likes } })
            .select('_id name profilePic')
            .lean()

        const followers = await userModel
            .find({ _id: { $in: user.followers } })
            .select('_id name profilePic')
            .lean()

        const notifications = {
            profileLikes,
            likesOnPrimaryPosts,
            likesOnSecondPosts,
            followers,
        }

        return res.status(200).json(notifications)
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao buscar notificações do usuário',
            error,
        })
    }
}
