import { NextFunction, Request, Response } from 'express'

export const validBody = (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body as { content: string }

    if (!content || content.trim() === '') {
        return res
            .status(400)
            .json({ error: 'Missing props: content is required' })
    }

    next()
}
