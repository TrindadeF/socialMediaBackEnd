import { Request, Response } from 'express'
import { userModel } from '../../models/users'
import mongoose from 'mongoose'

export const blockUser = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuário não autenticado.' })
        }

        const userId = req.user.id
        const { blockUserId } = req.params

        console.log(`blockUserId recebido: ${blockUserId}`)

        if (!blockUserId || !mongoose.Types.ObjectId.isValid(blockUserId)) {
            return res.status(400).json({ message: 'ID inválido.' })
        }

        const blockUserObjectId = new mongoose.Types.ObjectId(blockUserId)

        const user = await userModel.findById(userId)
        if (!user) {
            return res
                .status(404)
                .json({ message: 'Usuário autenticado não encontrado.' })
        }

        const userToBlock = await userModel.findById(blockUserObjectId)
        if (!userToBlock) {
            return res
                .status(404)
                .json({ message: 'Usuário a ser bloqueado não encontrado.' })
        }

        
        if (user.blockedUsers.some((id) => id.toString() === blockUserId)) {
            return res
                .status(400)
                .json({ message: 'Usuário já está bloqueado.' })
        }

        user.blockedUsers.push(blockUserObjectId as any)
        await user.save()

        res.status(200).json({ message: 'Usuário bloqueado com sucesso.' })
    } catch (error: any) {
        console.error('Erro ao bloquear o usuário:', error)
        res.status(500).json({
            message: 'Erro ao bloquear o usuário.',
            error: error.message,
        })
    };

    
    
};

export const unblockUser = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }

        const userId = req.user.id;
        const { unblockUserId } = req.params;

        console.log(`unblockUserId recebido: ${unblockUserId}`);

        if (!unblockUserId || !mongoose.Types.ObjectId.isValid(unblockUserId)) {
            return res.status(400).json({ message: 'ID inválido.' });
        }

        const unblockUserObjectId = new mongoose.Types.ObjectId(unblockUserId);

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário autenticado não encontrado.' });
        }

        const userToUnblock = await userModel.findById(unblockUserObjectId);
        if (!userToUnblock) {
            return res.status(404).json({ message: 'Usuário a ser desbloqueado não encontrado.' });
        }

        
        const isBlocked = user.blockedUsers.some((id) => id.toString() === unblockUserId);
        if (!isBlocked) {
            return res.status(400).json({ message: 'Usuário não está bloqueado.' });
        }

        
        user.blockedUsers = user.blockedUsers.filter((id) => id.toString() !== unblockUserId);
        await user.save();

        res.status(200).json({ message: 'Usuário desbloqueado com sucesso.' });
    } catch (error: any) {
        console.error('Erro ao desbloquear o usuário:', error);
        res.status(500).json({
            message: 'Erro ao desbloquear o usuário.',
            error: error.message,
        });
    }
};
