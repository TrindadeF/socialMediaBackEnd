import { Request, Response } from 'express'
import { userModel } from '../../models/users'
import { User } from '../../database'

export const createUser = async (req: Request, res: Response) => {
    const user: User = req.body
    try {
        await userModel.create(user)
        return res.status(200).json({ message: 'User created successfully' })
    } catch (error) {
        return res.status(400).json({ error })
    }
}
