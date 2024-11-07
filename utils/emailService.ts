import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
})

export const sendWelcomeEmail = (userEmail: string) => {
    const mailOptions = {
        from: 'nakedlove@example.com',
        to: userEmail,
        subject: 'Bem-vindo ao Naked Love!',
        html: `
      <p>Bem-vindo ao Naked Love, onde as conexões são autênticas e o amor é descoberto sem filtros. Explora uma nova forma de encontrar a tua alma gémea, despida de superficialidades. O amor verdadeiro começa aqui!</p>
      <p>Este site é destinado exclusivamente a maiores de 18 anos. Ao continuar, confirmas que tens idade legal para explorar conteúdos voltados para um público adulto.</p>
    `,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar o e-mail:', error)
        } else {
            console.log('E-mail enviado: ' + info.response)
        }
    })
}
