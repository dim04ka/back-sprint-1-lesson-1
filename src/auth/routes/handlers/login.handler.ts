import { Request, Response } from 'express'
import { LoginDto } from '../../types/login.dto'
import { authService } from '../../service/auth.service'
import { HttpStatus } from '../../../core/types/http-statuses'
import { errorsHandler } from '../../../core/errors/errors.handler'
// import { appConfig } from '../../../common/config/config'

export const loginHandler = async (
    req: Request<{}, {}, LoginDto>,
    res: Response
) => {
    try {
        const { loginOrEmail, password } = req.body

        const result = await authService.login({
            loginOrEmail,
            password,
        })

        if (!result) {
            return res.sendStatus(HttpStatus.Unauthorized)
        }

        const { accessToken, refreshToken } = result

        if (!result?.accessToken) {
            return res.sendStatus(HttpStatus.BadRequest)
        }

        res.cookie('refreshToken', refreshToken, {httpOnly: true,secure: true})
        return res.send({accessToken})
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
