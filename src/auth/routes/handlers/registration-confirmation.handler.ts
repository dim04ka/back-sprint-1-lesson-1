import { errorsHandler } from '../../../core/errors/errors.handler'
import { Request, Response } from 'express'
import { usersRepository } from '../../../composition-root'
import { HttpStatus } from '../../../core/types/http-statuses'
import { WithId } from 'mongodb'
import { User } from '../../../users/domain/user.entity'

export const registrationConfirmationHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const { code } = req.body

        const user = (await usersRepository.findByConfirmationCode(
            code
        )) as unknown as WithId<User>
        if (
            !user ||
            user.emailConfirmation.isConfirmed ||
            user.emailConfirmation.expirationDate < new Date()
        ) {
            return res.status(HttpStatus.BadRequest).send({
                errorsMessages: [
                    {
                        field: 'code',
                        message: 'code not found or expired',
                    },
                ],
            })
        }

        user.emailConfirmation.isConfirmed = true
        await usersRepository.update(user)

        return res.status(HttpStatus.NoContent).send({
            message: 'email confirmed',
        })
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
