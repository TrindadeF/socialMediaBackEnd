// userController.ts
import { Request, Response } from 'express' // Importando tipos de Request e Response
import { userModel } from '../../models/users'

export const getAllUsers = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const users = await userModel.find() // Busca todos os usuários
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error })
    }
}
