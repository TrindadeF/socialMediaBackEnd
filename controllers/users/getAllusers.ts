import { Request, Response } from 'express'
import { userModel } from '../../models/users'
import primaryFeed from '../../models/primaryFeed'
import secondFeed from '../../models/secondFeed'

export const getAllUsersWithPosts = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const users = await userModel.find().lean()

        const usersWithPosts = await Promise.all(
            users.map(async (user) => {
                const primaryPosts = await primaryFeed
                    .find({ owner: user._id })
                    .lean()
                const secondPosts = await secondFeed
                    .find({ owner: user._id })
                    .lean()

                return {
                    ...user,
                    primaryPosts,
                    secondPosts,
                }
            })
        )

        res.status(200).json(usersWithPosts)
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar usuários e posts',
            error,
        })
    }
}
