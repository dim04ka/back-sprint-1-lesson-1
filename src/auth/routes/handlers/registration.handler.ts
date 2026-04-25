import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { usersService } from '../../../users/service/users.service'

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

        const result = await usersService.registerUser({
            email,
            login,
            password,
        })

        if (result?.status === 'success')
            return res.sendStatus(HttpStatus.Created)
        return res.sendStatus(HttpStatus.Created)
    } catch (e: unknown) {
        // errorsHandler(e, res)
    }
}
