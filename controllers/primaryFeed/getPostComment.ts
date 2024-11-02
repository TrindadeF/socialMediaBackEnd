import { Request, Response } from 'express'
import { commentsModel } from '../../models/comments'
import mongoose from 'mongoose'

export const getPostComments = async (req: Request, res: Response) => {
    const { postId } = req.params

    try {
        const postObjectId = new mongoose.Types.ObjectId(postId)

        const comments = await commentsModel
            .find({ postId: postObjectId })
            .populate({
                path: 'owner',
                select: 'nickName profilePic',
            })
            .exec()

        const formattedComments = comments.map((comment) => {
            const commentOwner = comment.owner as unknown as {
                nickName: string
                profilePic: string
            }

            return {
                _id: comment._id,
                content: comment.content,
                createdAt: comment.createdAt,
                owner: {
                    nickName: commentOwner.nickName,
                    profilePic: commentOwner.profilePic,
                },
            }
        })

        return res.status(200).json(formattedComments)
    } catch (error) {
        console.error(error)
        return res
            .status(400)
            .json({ error: 'Erro ao buscar comentários do post' })
    }
}
