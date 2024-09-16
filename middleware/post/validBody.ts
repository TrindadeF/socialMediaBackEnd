import { NextFunction, Request, Response } from 'express'
import { Post } from '../../database'

export const validBody = (req: Request, res: Response, next: NextFunction) => {
    const { owner, content } = req.body as Post
    if (!owner || !content)
        return res.status(400).json({ error: 'Missin props' })
    next()
}
