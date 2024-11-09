"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const users_1 = require("../../models/users");
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield users_1.userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado.' });
            return;
        }
        const token = crypto_1.default.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        yield user.save();
        const resetLink = `http://localhost:4200/reset-password/${token}`;
        const mailOptions = {
            from: 'nakedlove.service@gmail.com',
            to: user.email,
            subject: 'Redefinição de senha',
            text: `Você solicitou uma redefinição de senha. Clique no link para redefinir sua senha: ${resetLink}`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({
                    message: 'Erro ao enviar o e-mail.',
                    error: error.message,
                });
                return;
            }
            res.json({ message: 'E-mail enviado com sucesso.' });
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});
exports.forgotPassword = forgotPassword;
