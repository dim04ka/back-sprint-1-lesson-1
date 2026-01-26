import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { postsRepository } from '../../repository'
import { postService } from '../../application/post.service'
import { errorsHandler } from '../../../core/errors/errors.handler'

export const deletePostHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const id = req.params.id
        await postService.delete(id)
        res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
