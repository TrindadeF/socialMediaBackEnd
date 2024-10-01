import { Response, Request } from 'express'
import { Post } from '../../database'
import PostModel from '../../models/post'

export const createPost = async (req: Request, res: Response) => {
    const { content } = req.body as { content: string }
    const userId = req.user?.id

    if (!userId) {
        return res.status(401).json({ error: 'Missing user ID' })
    }

    try {
        const newPost = await PostModel.create({
            content,
            owner: userId,
            createdAt: new Date(),
            likes: 0,
        })

        return res
            .status(201)
            .json({ message: 'Post created successfully', post: newPost })
    } catch (error: any) {
        return res
            .status(400)
            .json({ error: error.message || 'Error creating post' })
    }
}
