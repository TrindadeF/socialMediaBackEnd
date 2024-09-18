import { Response, Request } from 'express'
import { Post } from '../../database'
import PostModel from '../../models/post'

export const creatPost = async (req: Request, res: Response) => {
    const post = req.body as Post
    try {
        await PostModel.create(post)
        return res.status(200).json({ message: 'Post created successfully' })
    } catch (error) {
        return res.status(400).json({ error })
    }
}
