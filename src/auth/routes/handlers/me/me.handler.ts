import { HttpStatus } from '../../../../core/types/http-statuses'
import { Request, Response } from 'express'
import { usersQueryRepository } from '../../../../composition-root'

export const meHandler = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.sendStatus(HttpStatus.Unauthorized)

        const me = await usersQueryRepository.findById(req.user.id)

        return res.status(HttpStatus.Ok).send({
            email: me?.email,
            login: me?.login,
            userId: me?.id,
        })
    } catch (e: unknown) {
        // errorsHandler(e, res)
    }
}
