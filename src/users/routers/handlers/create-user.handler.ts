import { Request, Response } from 'express'

import { HttpStatus } from '../../../core/types/http-statuses'
import { errorsHandler } from '../../../core/errors/errors.handler'
import {
    usersService,
    usersQueryRepository,
} from '../../../composition-root'

export const createUserHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const { email, login, password } = req.body
        const user = await usersService.create({
            email,
            login,
            password,
        })
        const newUser = await usersQueryRepository.findById(user)
        res.status(HttpStatus.Created).send(newUser)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
