import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { userModel } from '../../models/users'

export const followUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const currentUserId = req.user?.id as string
        const { targetUserId } = req.params

        const currentUser = await userModel.findById(currentUserId)
        const targetUser = await userModel.findById(targetUserId)

        if (!currentUser || !targetUser) {
            res.status(404).json({ message: 'Usuário não encontrado' })
            return
        }

        const isFollowing = currentUser.following.some(
            (id) => id.toString() === targetUserId
        )

        if (isFollowing) {
            currentUser.following = currentUser.following.filter(
                (id) => id.toString() !== targetUserId
            )
            targetUser.followers = targetUser.followers.filter(
                (id) => id.toString() !== currentUserId
            )
            await currentUser.save()
            await targetUser.save()
            res.status(200).json({
                message: 'Você deixou de seguir este usuário',
            })
        } else {
            currentUser.following.push(
                new mongoose.Types.ObjectId(targetUserId) as any
            )
            targetUser.followers.push(
                new mongoose.Types.ObjectId(currentUserId) as any
            )
            await currentUser.save()
            await targetUser.save()
            res.status(200).json({
                message: 'Você agora está seguindo este usuário',
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: 'Erro ao seguir/deixar de seguir o usuário',
        })
    }
}
