import { Request, Response } from 'express'
import { userModel } from '../../models/users'

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' })
        }

        await userModel.deleteOne({ _id: id })
        return res.status(200).json({ message: 'Usuário deletado com sucesso' })
    } catch (error: any) {
        return res
            .status(400)
            .json({ error: error.message || 'Erro ao deletar usuário' })
    }
}
