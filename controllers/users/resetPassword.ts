import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { Request, Response } from 'express'
import { userModel } from '../../models/users'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
})

export const forgotPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { email }: { email: string } = req.body

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado.' })
            return
        }

        const token = crypto.randomBytes(32).toString('hex')

        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 3600000
        await user.save()

        const resetLink = `http://localhost:4200/reset-password/${token}`
        const mailOptions = {
            from: 'nakedlove.service@gmail.com',
            to: user.email,
            subject: 'Redefinição de senha',
            text: `Você solicitou uma redefinição de senha. Clique no link para redefinir sua senha: ${resetLink}`,
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({
                    message: 'Erro ao enviar o e-mail.',
                    error: error.message,
                })
                return
            }
            res.json({ message: 'E-mail enviado com sucesso.' })
        })
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor.' })
    }
}
