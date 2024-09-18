import { Request, Response } from 'express'
import { userModel } from '../../models/users'
import { User } from '../../database'

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req.body as User
    try {
        await userModel.updateOne({ _id: id }, user)
        return res.status(200).json({ message: 'updated' })
    } catch (error) {
        return res.status(400).json({ error })
    }
}
