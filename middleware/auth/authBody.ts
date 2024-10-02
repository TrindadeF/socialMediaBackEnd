import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authBody = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' })
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.SECURITY_KEY || 'defaultSecret'
        )
        req.user = decoded as { id: string; email: string }
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' })
    }
}
