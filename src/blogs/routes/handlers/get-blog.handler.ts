import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { blogsService } from '../../application/blogs.service'
import { mapToBlogOutput } from '../mapper/map-to-blog-output.util'
import { errorsHandler } from '../../../core/errors/errors.handler'

export const getBlogHandler = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const blog = await blogsService.findById(id)

        const blogOutput = mapToBlogOutput(blog)
        res.status(HttpStatus.Ok).send(blogOutput)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
