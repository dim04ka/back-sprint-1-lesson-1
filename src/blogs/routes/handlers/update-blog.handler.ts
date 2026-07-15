import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { BlogUpdateInputDto } from '../../domain'
import { errorsHandler } from '../../../core/errors/errors.handler'
import { blogsService } from '../../../composition-root'

export const updateBlogHandler = async (
    req: Request<{ id: string }, {}, BlogUpdateInputDto>,
    res: Response
) => {
    try {
        const id = req.params.id
        await blogsService.findById(id)
        const { name, description, websiteUrl } = req.body
        const updatedBlog: BlogUpdateInputDto = {
            name,
            description,
            websiteUrl,
        }
        await blogsService.update({ id, blog: updatedBlog })
        res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
