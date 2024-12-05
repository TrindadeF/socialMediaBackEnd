import { Request, Response } from 'express'
import secondFeedModel from '../../models/secondFeed'

export const getPostsByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string | undefined

        const filter = userId ? { owner: userId } : {}

        const posts = await secondFeedModel
            .find(filter)
            .populate('owner', '_id nickName profilePic')
            .populate('comments.owner', 'nickName')
            .exec()

        const postsWithLikes = posts.map((post) => {
            const owner = post.owner as unknown as {
                _id: string
                nickName: string
                profilePic: string
            }

            return {
                _id: post._id,
                ownerName: owner.nickName,
                ownerProfileImageUrl: owner.profilePic,
                postOwnerId: owner._id.toString(),
                content: post.content,
                createdAt: post.createdAt,
                media: post.media,
                likes: post.likes.length,
                
            }
        })

        return res.status(200).json(postsWithLikes)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Erro ao buscar posts' })
    }
}
