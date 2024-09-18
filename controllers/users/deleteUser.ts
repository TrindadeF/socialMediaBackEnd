import { Request, Response } from 'express'
import { User } from '../../database'
import { userModel } from '../../models/users'

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        await userModel.deleteOne({ _id: id })
        return res.status(200).json({ message: 'deleted' })
    } catch (error) {
        return res.status(400).json({ error })
    }
}
