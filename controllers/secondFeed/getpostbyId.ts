import { Request, Response } from 'express'
import secondFeedModel from '../../models/secondFeed'

export const getPostsByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string | undefined

        const filter = userId ? { owner: userId } : {}
        const posts = await secondFeedModel
            .find(filter)
            .populate('owner', '_id nickName profilePic')
            .populate('comments.owner', '_id nickName')
            .exec()
        const postsWithDetails = posts.map((post) => {
            const owner = post.owner as unknown as {
                _id: string
                nickName: string
                profilePic: string
            }

            return {
                _id: post._id,
                owner: {
                    _id: owner._id,
                    nickName: owner.nickName,
                    profilePic: owner.profilePic,
                },
                content: post.content,
                createdAt: post.createdAt,
                media: post.media,
                likesCount: Array.isArray(post.likes) ? post.likes.length : 0,
                comments: post.comments.map((comment: any) => ({
                    _id: comment._id,
                    text: comment.text,
                    owner: {
                        _id: comment.owner._id,
                        nickName: comment.owner.nickName,
                    },
                })),
            }
        })

        return res.status(200).json(postsWithDetails)
    } catch (error: any) {
        console.error('Erro ao buscar posts:', error)
        return res
            .status(500)
            .json({ error: 'Erro ao buscar posts', details: error.message })
    }
}
