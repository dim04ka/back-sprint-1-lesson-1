import { Router } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { authService } from '../service/auth.service'
import { passwordValidation } from '../../users/api/middleware/password.validation'
import { loginOrEmailValidation } from '../../users/api/middleware/login.or.emaol.validation'
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware'
import { LoginDto } from '../types/login.dto'
import { Request, Response } from 'express'
import { errorsHandler } from '../../core/errors/errors.handler'

export const authRouter = Router()

authRouter.post(
    '/login',
    passwordValidation,
    loginOrEmailValidation,
    inputValidationResultMiddleware,
    async (req: Request<{}, {}, LoginDto>, res: Response) => {
        try {
            console.log('login')
            const { loginOrEmail, password } = req.body

            const accessToken = await authService.login({
                loginOrEmail,
                password,
            })
            console.log('accessToken', accessToken)

            if (!accessToken) {
                return res.sendStatus(HttpStatus.Unauthorized)
            }

            return res.sendStatus(HttpStatus.NoContent)
        } catch (e: unknown) {
            errorsHandler(e, res)
        }
    }
)
