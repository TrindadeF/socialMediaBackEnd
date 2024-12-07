import { Request, Response } from 'express'
import PostModel from '../../models/secondFeed'

export const getPosts = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string

        const filter = userId ? { owner: userId } : {}

        const posts = await PostModel.find(filter)
            .populate({
                path: 'owner',
                select: 'nickName profilePic _id',
                match: { nickName: { $exists: true } },
            })
            .exec()

        const postsWithLikes = posts.map((post) => {
            const owner = post.owner as unknown as {
                nickName: string
                profilePic: string
                _id: string
            }

            return {
                _id: post._id,
                owner: {
                    _id: owner._id.toString(),
                    nickName: owner.nickName,
                    profilePic: owner.profilePic,
                },
                content: post.content,
                createdAt: post.createdAt,
                media: post.media,
                likes: post.likes,
            }
        })

        return res.status(200).json(postsWithLikes)
    } catch (error: any) {
        console.error('Erro ao buscar posts:', error.message || error)
        return res.status(400).json({
            error: 'Erro ao buscar posts',
            details: error.message || null,
        })
    }
}
