import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { CreatePost } from '../../dto'
import { postsService } from '../../../composition-root'
import { errorsHandler } from '../../../core/errors/errors.handler'

export const updatePostHandler = async (
    req: Request<{ id: string }, {}, CreatePost>,
    res: Response
) => {
    try {
        const id = req.params.id

        const { title, shortDescription, content, blogId } = req.body
        const updatedPost: CreatePost = {
            title,
            shortDescription,
            content,
            blogId,
        }
        await postsService.update({ id, post: updatedPost })
        res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
