// userController.ts
import { Request, Response } from 'express' 
import { userModel } from '../../models/users'

export const getAllUsers = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const users = await userModel.find() 
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error })
    }
}
