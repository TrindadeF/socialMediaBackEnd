import { Request, Response } from 'express'
import { Post } from '../../models/post'

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find()
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(400).json({ error })
    }
}
