import { Router } from 'express'
import { passwordValidation } from '../../users/api/middleware/password.validation'
import { loginOrEmailValidation } from '../../users/api/middleware/login.or.emaol.validation'
import {
    inputValidationResultMiddleware,
    limitedRequestMiddleware,
} from '../../core/middlewares/validation'
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
    limitedRequestMiddleware({}),
    registrationConfirmationHandler
)

authRouter.post(
    '/registration-email-resending',
    emailValidation,
    inputValidationResultMiddleware,
    limitedRequestMiddleware({}),
    registrationEmailResendingHandler
)

authRouter.post(
    '/registration',
    registrationValidationMiddleware,
    inputValidationResultMiddleware,
    limitedRequestMiddleware({}),
    registrationHandler
)

authRouter.post(
    '/login',
    passwordValidation,
    loginOrEmailValidation,
    inputValidationResultMiddleware,
    limitedRequestMiddleware({}),
    loginHandler
)

authRouter.get('/me', accessTokenGuard, meHandler)

authRouter.post('/refresh-token', refreshTokenHandler)

authRouter.post('/logout', logoutHandler)
