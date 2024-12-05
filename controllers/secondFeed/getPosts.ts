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
            .populate('owner', 'nickName profilePic _id id')
            .exec()

        const postsWithLikes = posts.map((post) => {
            const owner = post.owner as unknown as {
                nickName: string
                profilePic: string
                _id: string
                id: string
            }

            return {
                _id: post._id,
                idDono: owner._id,
                idDono2: owner.id,
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
