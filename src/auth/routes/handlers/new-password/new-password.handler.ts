import { Request, Response } from 'express'

import { HttpStatus } from '../../../../core/types/http-statuses'
import { bcryptService } from '../../../adapters/bcrypt.service'
import { usersRepository } from '../../../../composition-root'
import { WithId } from 'mongodb'
import { User } from '../../../../users/domain/user.entity'

export const newPasswordHandler = async (
    req: Request,
    res: Response
) => {
    const { newPassword, recoveryCode } = req.body
    const user = (await usersRepository.findByConfirmationCode(
        recoveryCode
    )) as unknown as WithId<User>
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
