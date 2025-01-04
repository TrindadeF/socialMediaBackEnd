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
        subject: 'Welcome to Naked Love!',
        html: `
      <p>Welcome to Naked Love, where connections are authentic and love is discovered without filters. Explore a new way to find your soulmate, stripped of superficiality. True love starts here!</p>
      <p>This site is intended exclusively for those over 18 years of age. By continuing, you confirm that you are of legal age to explore content intended for an adult audience.</p>
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
