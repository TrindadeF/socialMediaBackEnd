import { Request, Response } from 'express'
import { userModel } from '../../models/users'

export const isFollowing = async (req: Request, res: Response) => {
    try {
        const { userId, targetUserId } = req.params

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }

        const isFollowing = user.following.some(
            (followingId) => followingId.toString() === targetUserId
        )

        res.json(isFollowing)
    } catch (error) {
        console.error('Erro ao verificar o estado de seguir:', error)
        res.status(500).json({
            message: 'Erro ao verificar o estado de seguir',
        })
    }
}

export const getNewFollowers = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }

        const newFollowers = await userModel.find({
            following: userId,
        })

        const followersData = newFollowers.map((follower) => ({
            id: follower._id,
            name: follower.name,
            profilePic: follower.profilePic || 'default-avatar.jpg',
            followedAt: follower.updatedAt,
        }))

        res.json(followersData)
    } catch (error) {
        console.error('Erro ao obter novos seguidores:', error)
        res.status(500).json({ message: 'Erro ao obter novos seguidores' })
    }
}
