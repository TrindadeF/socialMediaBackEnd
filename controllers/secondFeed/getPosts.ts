import { Request, Response } from 'express'
import PostModel from '../../models/secondFeed'

export const getPosts = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId

        let filter = {}
        if (userId) {
            filter = { owner: userId }
        }

        const posts = await PostModel.find(filter)
            .populate('owner', 'nickName profilePic')
            .exec()

        const postsWithLikes = posts.map((post) => {
            const owner = post.owner as unknown as {
                nickName: string
                profilePic: string
            }

            return {
                _id: post._id,
                ownerName: owner.nickName,
                ownerProfileImageUrl: owner.profilePic,
                postOwnerId: post.owner._id,
                content: post.content,
                createdAt: post.createdAt,
                media: post.media,
                likes: post.likes,
            }
        })

        return res.status(200).json(postsWithLikes)
    } catch (error) {
        console.error(error)
        return res.status(400).json({ error: 'Erro ao buscar posts' })
    }
}
