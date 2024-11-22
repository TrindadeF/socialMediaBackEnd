import { Request, Response } from 'express';
import { userModel } from '../../models/users';
import { User } from '../../database';
import { FileWithLocation } from '../../types';

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, age, gender, email, nickName, description, isAnonymous } = req.body; 

    const file = req.file as FileWithLocation;
    const profilePicUrl = file?.location || req.body.profilePicUrl;

    const userIdFromToken = req.user?.id;

    if (userIdFromToken !== id) {
        return res.status(403).json({
            message: 'Você não tem permissão para editar este perfil.',
        });
    }

    const updateData: Partial<User> = {};
    if (name) updateData.name = name;
    if (age) updateData.age = age;
    if (gender) updateData.gender = gender;
    if (email) updateData.email = email;
    if (nickName) updateData.nickName = nickName;
    if (description) updateData.description = description;
    if (profilePicUrl) updateData.profilePic = profilePicUrl;
    if (isAnonymous !== undefined) updateData.isAnonymous = isAnonymous; 
    if (!isAnonymous) {
        if (name) updateData.name = name;
        if (age) updateData.age = age;
        if (description) updateData.description = description;
    }
    try {
        if (Object.keys(updateData).length === 0) {
            return res
                .status(400)
                .json({ message: 'Nenhuma alteração foi enviada.' });
        }

        const result = await userModel.updateOne(
            { _id: id },
            { $set: updateData }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({
                message: 'Usuário não encontrado ou nenhum dado alterado.',
            });
        }

        return res.status(200).json({
            message: 'Perfil atualizado com sucesso!',
            updatedData: updateData,
        });
    } catch (error) {
        console.error('Erro durante a atualização:', error);
        return res
            .status(500)
            .json({ error: 'Erro ao atualizar perfil', details: error });
    }
};
