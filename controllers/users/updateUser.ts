import { Request, Response } from 'express'
import { userModel } from '../../models/users'
import { User } from '../../database'

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const { name, age, gender, email, nickName, description } = req.body

    const updateData: Partial<User> = {}

    if (name) updateData.name = name
    if (age) updateData.age = age
    if (gender) updateData.gender = gender
    if (email) updateData.email = email
    if (nickName) updateData.nickName = nickName
    if (description) updateData.description = description

    if (req.file) {
        updateData.profilePic = req.file.path
    }

    try {
        if (Object.keys(updateData).length === 0) {
            return res
                .status(400)
                .json({ message: 'Nenhuma alteração foi enviada.' })
        }

        console.log('Tentando atualizar o seguinte usuário:', id)
        console.log('Com os seguintes dados:', updateData)

        const result = await userModel.updateOne(
            { _id: id },
            { $set: updateData }
        )

        console.log('Resultado da atualização:', result)

        if (result.modifiedCount === 0) {
            return res.status(404).json({
                message: 'Usuário não encontrado ou nenhum dado alterado.',
            })
        }

        return res
            .status(200)
            .json({ message: 'Perfil atualizado com sucesso' })
    } catch (error) {
        console.error('Erro durante a atualização:', error)
        return res
            .status(500) // Altere para 500 para indicar erro interno do servidor
            .json({ error: 'Erro ao atualizar perfil', details: error })
    }
}
