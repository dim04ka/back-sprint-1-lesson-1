import { Request, Response } from 'express'
import { usersRepository } from '../../../../users/repository/users.repository'
import { HttpStatus } from '../../../../core/types/http-statuses'
import { bcryptService } from '../../../adapters/bcrypt.service'

export const newPasswordHandler = async (
    req: Request,
    res: Response
) => {
    const { newPassword, recoveryCode } = req.body
    const user =
        await usersRepository.findByConfirmationCode(recoveryCode)
    if (!user) {
        return res.status(HttpStatus.BadRequest).send({
            errorsMessages: [
                {
                    field: 'recoveryCode',
                    message: 'Recovery code is incorrect',
                },
            ],
        })
    }
    const passwordHash = await bcryptService.generateHash(newPassword)
    user.password = passwordHash
    await usersRepository.update({ ...user, password: passwordHash })
    return res.status(HttpStatus.NoContent).send({})
}
