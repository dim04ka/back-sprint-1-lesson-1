import { Router } from 'express'
import { superAdminGuardMiddleware } from '../../core/middlewares/super-admin.guard-middleware'
import { HttpStatus } from '../../core/types/http-statuses'
import { usersService } from '../service/users.service'
import { passwordValidation } from '../api/middleware/password.validation'
import { loginValidation } from '../api/middleware/login.validation'
import { emailValidation } from '../api/middleware/email.validation'
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware'

import { CreateUserDto } from '../types/create-user.dto'
import { Request, Response } from 'express'
import { sortQueryFieldsUtil } from '../../core/utils/sortQueryFields.util'
import { usersQwRepository } from '../repository/user.query.repository'

export const usersRouter = Router()
usersRouter.get(
    '/',
    superAdminGuardMiddleware,
    async (req: Request, res: Response) => {
        const { pageNumber, pageSize, sortBy, sortDirection } =
            sortQueryFieldsUtil(req.query)

        const allUsers = await usersQwRepository.findAllUsers({
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        })

        return res.status(200).send(allUsers)
    }
)

usersRouter.post(
    '/',
    superAdminGuardMiddleware,
    passwordValidation,
    loginValidation,
    emailValidation,
    inputValidationResultMiddleware,
    async (req: Request<{}, {}, CreateUserDto>, res: Response) => {
        const { email, login, password } = req.body
        const user = await usersService.create({
            email,
            login,
            password,
        })
        const newUser = await usersQwRepository.findById(user)
        res.status(HttpStatus.Created).send(newUser)
    }
)

usersRouter.delete(
    '/:id',
    superAdminGuardMiddleware,
    async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params
        const isDeleted = await usersService.delete(id)
        if (!isDeleted) {
            return res.sendStatus(HttpStatus.NotFound)
        }
        res.sendStatus(HttpStatus.NoContent)
    }
)
