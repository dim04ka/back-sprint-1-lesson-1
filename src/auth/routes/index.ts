import { Router } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { authService } from '../service/auth.service'
import { passwordValidation } from '../../users/api/middleware/password.validation'
import { loginOrEmailValidation } from '../../users/api/middleware/login.or.emaol.validation'
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware'
import { LoginDto } from '../types/login.dto'
import { Request, Response } from 'express'
import { errorsHandler } from '../../core/errors/errors.handler'
import { accessTokenGuard } from './guard/access.token.guard'
import { usersQwRepository } from '../../users/repository/user.query.repository'

export const authRouter = Router()

authRouter.post(
    '/login',
    passwordValidation,
    loginOrEmailValidation,
    inputValidationResultMiddleware,
    async (req: Request<{}, {}, LoginDto>, res: Response) => {
        try {
            const { loginOrEmail, password } = req.body

            const accessToken = await authService.login({
                loginOrEmail,
                password,
            })

            if (!accessToken) {
                return res.sendStatus(HttpStatus.Unauthorized)
            }

            return (
                res
                    // .sendStatus(HttpStatus.NoContent)
                    .send(accessToken)
            )
        } catch (e: unknown) {
            errorsHandler(e, res)
        }
    }
)

authRouter.get(
    '/me',
    accessTokenGuard,
    async (req: Request, res: Response) => {
        if (!req.user) return res.sendStatus(HttpStatus.Unauthorized)

        const me = await usersQwRepository.findById(req.user.id)

        return res.status(HttpStatus.Ok).send(me)
    }
)
