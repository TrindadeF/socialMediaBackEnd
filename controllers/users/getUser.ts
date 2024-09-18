import { Request, Response } from 'express'
import { User } from '../../database'
import { userModel } from '../../models/users'

export const createUser = async (req: Request, res: Response) => {
    const user = req.body as User
    try {
        await userModel.create(user)
        return res.status(200).json({ message: 'user created' })
    } catch (error) {
        return res.status(400).json({ error })
    }
}
