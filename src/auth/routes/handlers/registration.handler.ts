import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
// import { usersService } from '../../../users/service/users.service'
import { ResultStatus } from '../../../common/result/resultCode'
import { authService } from '../../../composition-root'

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

        const result = await authService.createUser(login, email, password)




        if (result?.status === ResultStatus.Success)
            return res.status(HttpStatus.NoContent).send(result.data)
        return res.status(HttpStatus.BadRequest).send(result.extensions)
    } catch (e: unknown) {
        // errorsHandler(e, res)
    }
}
