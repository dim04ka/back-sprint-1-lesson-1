import { Router } from 'express'
import { superAdminGuardMiddleware } from '../../core/middlewares/super-admin.guard-middleware'
import { passwordValidation } from '../api/middleware/password.validation'
import { loginValidation } from '../api/middleware/login.validation'
import { emailValidation } from '../api/middleware/email.validation'
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware'
import {
    usersHandler,
    createUserHandler,
    deleteUserHandler,
} from './handlers'

export const usersRouter = Router()

usersRouter.get('/', superAdminGuardMiddleware, usersHandler)

usersRouter.post(
    '/',
    superAdminGuardMiddleware,
    passwordValidation,
    loginValidation,
    emailValidation,
    inputValidationResultMiddleware,
    createUserHandler
)

usersRouter.delete(
    '/:id',
    superAdminGuardMiddleware,
    deleteUserHandler
)
