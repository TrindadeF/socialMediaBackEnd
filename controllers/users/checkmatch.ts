import { Request, Response } from 'express'
import { userModel } from '../../models/users'

export const checkMutualLike = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.query.userId as string
        const otherUserId = req.query.otherUserId as string

        if (!userId || !otherUserId) {
            res.status(400).json({
                error: 'Both userId and otherUserId are required',
            })
            return
        }

        const user = await userModel.findById(userId).exec()
        const hasLiked =
            user &&
            Array.isArray(user.likes) &&
            user.likes.map(String).includes(otherUserId)

        const otherUser = await userModel.findById(otherUserId).exec()
        const hasMutualLike =
            hasLiked &&
            otherUser &&
            Array.isArray(otherUser.likes) &&
            otherUser.likes.map(String).includes(userId)

        res.status(200).json({ mutualLike: hasMutualLike })
    } catch (error) {
        console.error('Erro ao verificar o match entre os usuarios:', error)
        res.status(500).json({
            error: 'Erro ao verificar o match entre os usuarios',
        })
    }
}
