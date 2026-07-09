import { HttpStatus } from '../../../../core/types/http-statuses'
import { usersRepository } from '../../../../users/repository/users.repository'
import { Request, Response } from 'express'
import { emailExamples } from '../../../adapters/emailExamples'
import { nodemailerService } from '../../../adapters/nodemailer.service'
import { randomUUID } from 'crypto'

import { errorsHandler } from '../../../../core/errors/errors.handler'

export const passwordRecoveryHandler = async (
    req: Request,
    res: Response
) => {
    const { email } = req.body
    try {
        const user = await usersRepository.doesExistByEmail(email)
        if (!user || user.emailConfirmation.isConfirmed === false) {
            return res.status(HttpStatus.NoContent).send({})
        }
        const tempConfirmationCode = randomUUID()
        user.emailConfirmation.confirmationCode = tempConfirmationCode
        await usersRepository.update({
            ...user,
            emailConfirmation: {
                ...user.emailConfirmation,
                confirmationCode: tempConfirmationCode,
            },
        })

        await nodemailerService.sendEmail(
            email,
            tempConfirmationCode,
            emailExamples.passwordRecoveryEmail
        )

        return res.status(HttpStatus.NoContent).send()
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
