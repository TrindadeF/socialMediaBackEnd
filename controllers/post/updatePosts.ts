import { Request, Response } from 'express'
import { Post } from '../../database'
import postModel from '../../models/post'

export const updatePosts = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const post: Post = req.body
        await postModel.updateOne({ _id: id }, post)
        return res.status(200).json({ message: 'Posts updated' })
    } catch (error) {}
}
