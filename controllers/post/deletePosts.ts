import { Request, Response } from 'express'
import Post from '../../models/post'

export const deletePosts = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        await Post.deleteOne({ _id: id })
        return res.status(200).json({ message: 'Post delete successfully ' })
    } catch (error) {
        return res.status(400).json(error)
    }
}
