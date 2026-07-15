import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { postsService } from '../../../composition-root'
import { errorsHandler } from '../../../core/errors/errors.handler'

export const deletePostHandler = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const id = req.params.id
        await postsService.delete(id)
        res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
