import { Request, Response } from 'express'
import { LoginDto } from '../../types/login.dto'
// import { authService } from '../../service/auth.service'
import { HttpStatus } from '../../../core/types/http-statuses'
import { errorsHandler } from '../../../core/errors/errors.handler'
import { authService } from '../../../composition-root'
import { ResultStatus } from '../../../common/result/resultCode'

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

        if (result?.status === ResultStatus.Success) {
            return res.send(result.data)
        }

        return res.status(HttpStatus.BadRequest).send({errorsMessages: result.extensions})
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
