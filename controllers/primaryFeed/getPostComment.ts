import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { commentsModel } from '../../models/comments'
import primaryFeed from '../../models/primaryFeed'

// Defina interfaces para o formato da resposta
interface IPost {
    ownerName: string
    createdAt: Date
    content: string
    media: string[]
}

interface IComment {
    owner: {
        profilePic: string
        nickName: string
    }
    content: string
    createdAt: Date
}

interface IPostCommentsResponse {
    post: IPost
    comments: IComment[]
}

export const getPostComments = async (req: Request, res: Response) => {
    const { postId } = req.params

    try {
        const postObjectId = new mongoose.Types.ObjectId(postId)

        // Buscar o post específico e popular o proprietário
        const post = await primaryFeed
            .findById(postObjectId)
            .populate({
                path: 'owner',
                select: 'nickName', // Selecionar apenas o nickName do proprietário
            })
            .populate('comments') // Popular os comentários

        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' })
        }

        // Obter o proprietário do post
        const postOwner = post.owner as unknown as { nickName: string }

        // Buscar os comentários associados ao post e popular o proprietário de cada comentário
        const comments = await commentsModel
            .find({ postId: postObjectId })
            .populate({
                path: 'owner',
                select: 'nickName profilePic', // Selecionar o nickName e profilePic do proprietário do comentário
            })

        // Formatar os comentários
        const formattedComments = comments.map((comment) => {
            const commentOwner = comment.owner as unknown as {
                nickName: string
                profilePic: string
            }

            return {
                owner: {
                    profilePic: commentOwner.profilePic,
                    nickName: commentOwner.nickName,
                },
                content: comment.content,
                createdAt: comment.createdAt,
            }
        })

        // Estruturar a resposta final
        const response: IPostCommentsResponse = {
            post: {
                ownerName: postOwner.nickName, // Usando o nickname do proprietário do post
                createdAt: post.createdAt,
                content: post.content,
                media: post.media, // Supondo que o campo media existe
            },
            comments: formattedComments,
        }

        return res.status(200).json(response)
    } catch (error) {
        console.error(error)
        return res
            .status(500)
            .json({ error: 'Erro ao buscar comentários do post' })
    }
}
