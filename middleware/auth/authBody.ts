import { Request, Response, NextFunction } from 'express'
import { User } from '../../database'

export const authBody = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as User
    if (!email || !password)
        return res.status(400).json({ error: 'Empty fields' })
    next()
}
