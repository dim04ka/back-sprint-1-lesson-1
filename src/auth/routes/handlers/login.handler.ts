import { Request, Response } from 'express'
import { LoginDto } from '../../types/login.dto'
import { authService } from '../../service/auth.service'
import { HttpStatus } from '../../../core/types/http-statuses'
import { errorsHandler } from '../../../core/errors/errors.handler'

export const loginHandler = async (
    req: Request<{}, {}, LoginDto>,
    res: Response
) => {
    try {
        const { loginOrEmail, password } = req.body

        const accessToken = await authService.login({
            loginOrEmail,
            password,
        })

        if (!accessToken) {
            return res.sendStatus(HttpStatus.Unauthorized)
        }

        return res.send(accessToken)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
