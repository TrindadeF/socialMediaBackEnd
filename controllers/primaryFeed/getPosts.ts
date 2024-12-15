import { Request, Response } from 'express'
import PostModel from '../../models/primaryFeed'
import { userModel } from '../../models/users'

export const getPosts = async (req: Request, res: Response) => {
    try {
        const userId = req.user

        const user = await userModel
            .findById(userId)
            .select('blockedUsers')
            .exec()
        const blockedUsers = user?.blockedUsers || []

        const posts = await PostModel.find()
            .populate({
                path: 'owner',
                select: 'nickName profilePic',
                match: {
                    _id: { $nin: blockedUsers },
                    nickName: { $exists: true },
                },
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'owner',
                    select: 'nickName profilePic',
                    match: { _id: { $nin: blockedUsers } },
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

                const formattedComments = ((post.comments as any[]) || [])
                    .filter((comment) => comment.owner)
                    .map((comment) => {
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
                    })

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
        console.error('Error fetching posts:', error)
        return res.status(400).json({ error: 'Erro ao buscar posts' })
    }
}
