import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { errorsHandler } from '../../../core/errors/errors.handler'
import { usersService } from '../../../composition-root'

export const deleteUserHandler = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params
    try {
        const isDeleted = await usersService.delete(id)
        if (!isDeleted) {
            return res.sendStatus(HttpStatus.NotFound)
        }
        res.sendStatus(HttpStatus.NoContent)
    } catch (error) {
        errorsHandler(error, res)
    }
}
