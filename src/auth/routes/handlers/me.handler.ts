import { HttpStatus } from '../../../core/types/http-statuses'
import { Request, Response } from 'express'
import { usersQwRepository } from '../../../users/repository/user.query.repository'

export const meHandler = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.sendStatus(HttpStatus.Unauthorized)

        const me = await usersQwRepository.findById(req.user.id)

        return res.status(HttpStatus.Ok).send(me)
    } catch (e: unknown) {
        // errorsHandler(e, res)
    }
}
