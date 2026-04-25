import nodemailer from 'nodemailer'

export const nodemailerService = {
    async sendEmail(
        email: string,
        code: string,
        template: (code: string) => string
    ): Promise<boolean> {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        })

        let info: any = null

        try {
            info = await transporter.sendMail({
                from: 'from-mail@gmail.com',
                to: email,
                subject: 'Hey man',
                html: template(code),
            })
        } catch (e: unknown) {
            console.error('Send email error', e)
        }

        return !!info
    },
}
