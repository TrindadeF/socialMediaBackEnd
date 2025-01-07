"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});
const sendWelcomeEmail = (userEmail) => {
    const mailOptions = {
        from: 'nakedlove@example.com',
        to: userEmail,
        subject: 'Welcome to Naked Love!',
        html: `
      <p>Welcome to Naked Love, where connections are authentic and love is discovered without filters. Explore a new way to find your soulmate, stripped of superficiality. True love starts here!</p>
      <p>This site is intended exclusively for those over 18 years of age. By continuing, you confirm that you are of legal age to explore content intended for an adult audience.</p>
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar o e-mail:', error);
        }
        else {
            console.log('E-mail enviado: ' + info.response);
        }
    });
};
exports.sendWelcomeEmail = sendWelcomeEmail;
