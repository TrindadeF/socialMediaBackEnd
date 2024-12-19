import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
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

        const resetLink = `https://nakedlove.eu/api/reset-password/${token}`
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

export const resetPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { token, password }: { token: string; password: string } = req.body

    try {
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        })

        if (!user) {
            res.status(400).json({ message: 'Token inválido ou expirado.' })
            return
        }
        if (!password || password.length < 6) {
            res.status(400).json({
                message: 'A nova senha deve ter pelo menos 6 caracteres.',
            })
            return
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        user.password = hashedPassword
        user.resetPasswordToken = null
        user.resetPasswordExpires = null

        await user.save()

        res.json({ message: 'Senha redefinida com sucesso!' })
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({
                message: 'Erro no servidor.',
                error: err.message,
            })
        } else {
            res.status(500).json({
                message: 'Erro no servidor.',
                error: 'Erro desconhecido.',
            })
        }
    }
}
