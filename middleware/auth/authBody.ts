import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authBody = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1] // Obter o token do cabeçalho

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' })
    }

    try {
        const decoded = jwt.verify(token, process.env.SECURITY_KEY)
        req.user = decoded as { id: string; email: string }

        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: 'Empty fields' })
        }

        next() // Chama o próximo middleware ou controlador
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' })
    }
}
