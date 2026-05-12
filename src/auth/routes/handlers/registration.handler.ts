import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { usersService } from '../../../users/service/users.service'
import { Result } from '../../../common/result/result.type'
import { ResultStatus } from '../../../common/result/resultCode'
import { User } from '../../../users/domain/user.entity'
import { errorsHandler } from '../../../core/errors/errors.handler'

export type RegistrationDto = {
    login: string
    password: string
    email: string
}

export const registrationHandler = async (
    req: Request<{}, {}, RegistrationDto>,
    res: Response
) => {
    try {
        const { email, login, password } = req.body



        const result: Result<User | null> = await usersService.registerUser({
            email,
            login,
            password,
        })

        if (result?.status === ResultStatus.Success)
            return res.status(HttpStatus.Created).send(result.data)
        return res.status(HttpStatus.BadRequest).send({errorsMessages: result.extensions})
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
