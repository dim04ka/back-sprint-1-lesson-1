import { errorsHandler } from '../../../core/errors/errors.handler'
import { Request, Response } from 'express'
import { usersRepository } from '../../../users/repository/users.repository'
import { HttpStatus } from '../../../core/types/http-statuses'
import { add } from 'date-fns'
import { randomUUID } from 'crypto'
import { emailExamples } from '../../adapters/emailExamples'
import { nodemailerService } from '../../adapters/nodemailer.service'

export const registrationEmailResendingHandler = async (
    req: Request<{}, {}, { email: string }>,
    res: Response
) => {
    try {
        const { email } = req.body

        const user = await usersRepository.doesExistByEmail(email)
        if (!user || user.emailConfirmation.isConfirmed) {
            return res.status(HttpStatus.BadRequest).send({
                message: 'email not found or not confirmed',
            })
        }

        const newConfirmationCode = randomUUID()
        const newExpirationDate = add(new Date(), { minutes: 30 })
        user.emailConfirmation.confirmationCode = newConfirmationCode
        user.emailConfirmation.expirationDate = newExpirationDate
        await usersRepository.update(user)

        console.log('updated user==', user)

        try {
            await nodemailerService.sendEmail(
                email,
                user.emailConfirmation.confirmationCode,
                emailExamples.registrationEmail
            )
        } catch (e: unknown) {
            console.error('Send email error', e)
        }
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
