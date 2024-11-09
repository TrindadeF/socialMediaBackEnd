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
        subject: 'Bem-vindo ao Naked Love!',
        html: `
      <p>Bem-vindo ao Naked Love, onde as conexões são autênticas e o amor é descoberto sem filtros. Explora uma nova forma de encontrar a tua alma gémea, despida de superficialidades. O amor verdadeiro começa aqui!</p>
      <p>Este site é destinado exclusivamente a maiores de 18 anos. Ao continuar, confirmas que tens idade legal para explorar conteúdos voltados para um público adulto.</p>
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
