import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { blogsRepository } from '../../repository/blogs.repository'
import { Blog } from '../../domain'
import { errorsHandler } from '../../../core/errors/errors.handler'
import { blogsService } from '../../application/blogs.service'

export const updateBlogHandler = async (
    req: Request,
    res: Response
) => {
    try {

        const id = req.params.id
        // const blog = await blogsService.findById(id)

        // const { name, description, websiteUrl } = req.body
        // const updatedBlog: Blog = {
        //     name,
        //     description,
        //     websiteUrl,
        // }
        // await blogsService.update({ id, blog: updatedBlog })
        // res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
    
}
