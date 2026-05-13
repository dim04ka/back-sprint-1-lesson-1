import { Router } from 'express'
import { passwordValidation } from '../../users/api/middleware/password.validation'
import { loginOrEmailValidation } from '../../users/api/middleware/login.or.emaol.validation'
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware'
import { accessTokenGuard } from './guard/access.token.guard'
import {
    loginHandler,
    meHandler,
    registrationHandler,
    registrationEmailResendingHandler,
    registrationConfirmationHandler,
    refreshTokenHandler,
    logoutHandler,
} from './handlers'
import {
    registrationValidationMiddleware,
    emailValidation,
    codeValidation,
} from './validate/registration.validate'

export const authRouter = Router()

authRouter.post(
    '/registration-confirmation',
    codeValidation,
    inputValidationResultMiddleware,
    registrationConfirmationHandler
)

authRouter.post(
    '/registration-email-resending',
    emailValidation,
    inputValidationResultMiddleware,
    registrationEmailResendingHandler
)

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

authRouter.post('/refresh-token', refreshTokenHandler)

authRouter.post('/logout', logoutHandler)
