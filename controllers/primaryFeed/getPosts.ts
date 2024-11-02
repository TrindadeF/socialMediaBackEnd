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
            .populate({
                path: 'comments',
                populate: {
                    path: 'owner',
                    select: 'nickName profilePic',
                },
            })
            .exec()

        const postsWithComments = posts
            .filter((post) => post.owner && typeof post.owner !== 'string')
            .map((post) => {
                const owner = post.owner as unknown as {
                    nickName: string
                    profilePic: string
                }

                const formattedComments = (post.comments as any[]).map(
                    (comment) => {
                        const commentOwner = comment.owner as {
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
                    }
                )

                return {
                    _id: post._id,
                    ownerName: owner.nickName,
                    ownerProfileImageUrl: owner.profilePic,
                    content: post.content,
                    createdAt: post.createdAt,
                    media: post.media,
                    likes: post.likes,
                    owner: post.owner,
                    comments: formattedComments,
                }
            })

        return res.status(200).json(postsWithComments)
    } catch (error) {
        console.error(error)
        return res.status(400).json({ error: 'Erro ao buscar posts' })
    }
}
