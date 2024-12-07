import { Response, Request } from 'express'
import { userModel } from '../../models/users'
import mongoose from 'mongoose'

export const reportUser = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuário não autenticado.' })
        }

        const userId = req.user
        const { reportUserId } = req.params
        const { reason } = req.body

        if (userId.id === reportUserId) {
            return res
                .status(400)
                .json({ message: 'Você não pode se reportar.' })
        }

        if (!reason || reason.trim() === '') {
            return res
                .status(400)
                .json({ message: 'O motivo do reporte é obrigatório.' })
        }

        if (!mongoose.Types.ObjectId.isValid(reportUserId)) {
            return res.status(400).json({ message: 'ID do usuário inválido.' })
        }

        const userToReport = await userModel.findById(reportUserId)
        if (!userToReport) {
            return res
                .status(404)
                .json({ message: 'Usuário a ser reportado não encontrado.' })
        }

        const alreadyReported = userToReport.reports.some(
            (report) => report.reportedBy.toString() === userId.id
        )

        if (alreadyReported) {
            return res
                .status(400)
                .json({ message: 'Você já reportou este usuário.' })
        }

        userToReport.reports.push({
            reportedBy: new mongoose.Types.ObjectId(
                userId.id
            ) as unknown as mongoose.Schema.Types.ObjectId,
            reason,
            createdAt: new Date(),
        })

        await userToReport.save()

        res.status(200).json({ message: 'Usuário reportado com sucesso.' })
    } catch (error: any) {
        console.error(error)
        res.status(500).json({
            message: 'Erro ao reportar o usuário.',
            error: error.message,
        })
    }
}
