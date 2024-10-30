import { Request, Response } from 'express'
import PostModel from '../../models/primaryFeed'

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await PostModel.find()
            .populate({
                path: 'owner',
                select: 'nickName profilePic',
                match: { nickName: { $exists: true } },
            })
            .exec()

        const postsWithLikes = posts
            .filter((post) => post.owner && typeof post.owner !== 'string')
            .map((post) => {
                const owner = post.owner as unknown as {
                    nickName: string
                    profilePic: string
                }

                return {
                    _id: post._id,
                    ownerName: owner.nickName,
                    ownerProfileImageUrl: owner.profilePic,
                    content: post.content,
                    createdAt: post.createdAt,
                    media: post.media,
                    likes: post.likes,
                    owner: post.owner,
                }
            })

        return res.status(200).json(postsWithLikes)
    } catch (error) {
        console.error(error)
        return res.status(400).json({ error: 'Erro ao buscar posts' })
    }
}
