import { Request, Response } from 'express'
import { ObjectId } from 'mongoose'
import { userModel } from '../../models/users'

export const likeUser = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { userId, likedUserId } = req.body

        const user = await userModel.findById(userId)
        const likedUser = await userModel.findById(likedUserId)

        if (!user || !likedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado.' })
        }

        const userLikes: ObjectId[] = user.likes as unknown as ObjectId[]
        const likedUserLikes: ObjectId[] = likedUser.likes as unknown as ObjectId[]
        const userMatches: ObjectId[] = user.matches as unknown as ObjectId[]
        const likedUserMatches: ObjectId[] = likedUser.matches as unknown as ObjectId[]

        // Verifica se o usuário já curtiu este usuário
        if (
            userLikes.some(
                (likeId: ObjectId) =>
                    likeId.toString() === likedUserId.toString()
            )
        ) {
            return res
                .status(400)
                .json({ message: 'Você já curtiu este usuário.' })
        }

        // Adiciona o like ao usuário
        userLikes.push(likedUserId)
        user.likes = userLikes as any
        await user.save()

        // Adiciona a notificação para o usuário curtido
        likedUser.notifications.push({
            message: `${user.name} curtiu seu perfil!`,
            date: new Date()
        })
        await likedUser.save()

        // Verifica se há match entre os usuários
        if (
            likedUserLikes.some(
                (likeId: ObjectId) => likeId.toString() === userId.toString()
            )
        ) {
            userMatches.push(likedUserId)
            likedUserMatches.push(userId)

            user.matches = userMatches as any
            likedUser.matches = likedUserMatches as any

            await user.save()
            await likedUser.save()

            return res.status(200).json({ match: true })
        }

        return res.status(200).json({ match: false })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Erro ao processar o like.' })
    }
}
