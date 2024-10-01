import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authBody = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' })
    }

    console.log('Token recebido:', token)

    try {
        const decoded = jwt.verify(token, process.env.SECURITY_KEY)
        req.user = decoded as { id: string; email: string }
        console.log('Token decodificado:', req.user)
        next()
    } catch (error: any) {
        console.error('Erro ao verificar o token:', error.message)
        return res.status(401).json({ error: 'Token inválido' })
    }
}

export const validateLoginFields = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: 'Campos vazios' })
    }

    next()
}
