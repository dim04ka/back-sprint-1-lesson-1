import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { CreatePost } from '../../dto'
import { postService } from '../../application/post.service'
import { errorsHandler } from '../../../core/errors/errors.handler'

export const updatePostHandler = async (
    req: Request,
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
        await postService.update({ id, post: updatedPost })
        res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
