import { Request, Response } from 'express'
import secondFeedModel from '../../models/secondFeed'

export const getPostsByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string | undefined
        const filter = userId ? { owner: userId } : {}

        console.log('Filtro aplicado:', filter)

        const posts = await secondFeedModel
            .find(filter)
            .populate({
                path: 'owner',
                select: 'nickName profilePic _id',
                match: { nickName: { $exists: true } },
            })
            .populate('comments.owner', '_id nickName')
            .exec()

        console.log('Posts encontrados (direto do banco):', posts)

        const postsWithDetails = posts.map((post) => {
            if (!post.owner) {
                console.warn(`Post sem owner populado: ${post._id}`)
                throw new Error('Owner não encontrado para um ou mais posts')
            }

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
                comments: post.comments.map((comment: any) => {
                    if (!comment.owner) {
                        console.warn(`Comentário sem owner: ${comment._id}`)
                        return {
                            _id: comment._id,
                            text: comment.text,
                            owner: null,
                        }
                    }

                    return {
                        _id: comment._id,
                        text: comment.text,
                        owner: {
                            _id: comment.owner._id,
                            nickName: comment.owner.nickName,
                        },
                    }
                }),
            }
        })

        console.log('Resposta formatada:', postsWithDetails)

        return res.status(200).json(postsWithDetails)
    } catch (error: any) {
        console.error('Erro ao buscar posts:', error.message)
        return res
            .status(500)
            .json({ error: 'Erro ao buscar posts', details: error.message })
    }
}
