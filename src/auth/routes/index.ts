import { Router } from 'express'
import { passwordValidation } from '../../users/api/middleware/password.validation'
import { loginOrEmailValidation } from '../../users/api/middleware/login.or.emaol.validation'
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware'
import { accessTokenGuard } from './guard/access.token.guard'
import {
    loginHandler,
    meHandler,
    registrationHandler,
} from './handlers'
import { registrationValidationMiddleware } from './validate/registration.validate'

export const authRouter = Router()

authRouter.post(
    '/registration',
    registrationValidationMiddleware,
    inputValidationResultMiddleware,
    registrationHandler
)

authRouter.post(
    '/login',
    passwordValidation,
    loginOrEmailValidation,
    inputValidationResultMiddleware,
    loginHandler
)

authRouter.get('/me', accessTokenGuard, meHandler)
