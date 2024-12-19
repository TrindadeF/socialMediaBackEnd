import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { userModel } from '../../models/users';

// Configuração do transporter para envio de e-mails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email }: { email: string } = req.body;

    try {
        // Verifica se o e-mail do usuário existe no banco de dados
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado.' });
            return;
        }

        // Gera um token único para redefinição de senha
        const token = crypto.randomBytes(32).toString('hex');

        // Atualiza o modelo do usuário com o token e prazo de validade
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Token válido por 1 hora
        await user.save();

        // Link para a página de redefinição de senha
        const resetLink = `https://nakedlove.eu/reset-password`; // Página fixa para o frontend

        // Configuração do e-mail
        const mailOptions = {
            from: 'nakedlove.service@gmail.com',
            to: user.email,
            subject: 'Redefinição de senha',
            text: `Você solicitou uma redefinição de senha. Clique no link abaixo para redefinir sua senha:
            
${resetLink}
            
Se você não solicitou isso, ignore este e-mail.`,
        };

        // Envio do e-mail
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({
                    message: 'Erro ao enviar o e-mail.',
                    error: error.message,
                });
                return;
            }
            res.status(200).json({ message: 'E-mail enviado com sucesso.' });
        });
    } catch (err) {
        console.error('Erro no servidor:', err);
        res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
    }
};
