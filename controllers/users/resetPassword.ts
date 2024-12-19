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

// Função para envio do e-mail de redefinição de senha
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
        const resetLink = `https://nakedlove.eu/api/reset-password/${token}`;
        const mailOptions = {
            from: 'nakedlove.service@gmail.com',
            to: user.email,
            subject: 'Redefinição de senha',
            text: `Você solicitou uma redefinição de senha. Clique no link para redefinir sua senha: ${resetLink}`,
        };

        // Envio do e-mail
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                res.status(500).json({
                    message: 'Erro ao enviar o e-mail.',
                    error: error.message,
                });
                return;
            }
            res.json({ message: 'E-mail enviado com sucesso.' });
        });
    } catch (err) {
        console.error('Erro no servidor:', err);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

// Função para redirecionar ao clicar no link
export const resetPasswordRedirect = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;

    try {
        // Verifica se o token é válido e não expirou
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400).json({ message: 'Token inválido ou expirado.' });
            return;
        }

        // Redireciona para a página de redefinição de senha no frontend
        res.redirect(`https://nakedlove.eu/reset-password?token=${token}`);
    } catch (err) {
        console.error('Erro ao processar o token:', err);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};
