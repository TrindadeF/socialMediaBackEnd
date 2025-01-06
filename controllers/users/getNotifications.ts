import { Request, Response } from 'express'
import { userModel } from '../../models/users'
import primaryFeed from '../../models/primaryFeed'
import secondFeed from '../../models/secondFeed'

export const getNotifications = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const users = await userModel.find().lean()

        const usersWithDetails = await Promise.all(
            users.map(async (user) => {
                const primaryPosts = await primaryFeed
                    .find({ owner: user._id })
                    .lean()
                const secondPosts = await secondFeed
                    .find({ owner: user._id })
                    .lean()

                const likesOnPrimaryPosts = await Promise.all(
                    primaryPosts.map(async (post) => {
                        const usersWhoLiked = await userModel
                            .find({ _id: { $in: post.likes } })
                            .lean()
                        return {
                            postId: post._id,
                            likedBy: usersWhoLiked,
                        }
                    })
                )

                const likesOnSecondPosts = await Promise.all(
                    secondPosts.map(async (post) => {
                        const usersWhoLiked = await userModel
                            .find({ _id: { $in: post.likes } })
                            .lean()
                        return {
                            postId: post._id,
                            likedBy: usersWhoLiked,
                        }
                    })
                )

                const profileLikes = await userModel
                    .find({ _id: { $in: user.likes } })
                    .lean()

                const followers = await userModel
                    .find({ _id: { $in: user.followers } })
                    .lean()

                return {
                    ...user,
                    primaryPosts,
                    secondPosts,
                    likesOnPrimaryPosts,
                    likesOnSecondPosts,
                    profileLikes,
                    followers,
                }
            })
        )

        res.status(200).json(usersWithDetails)
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar usuários, posts e interações',
            error,
        })
    }
}
