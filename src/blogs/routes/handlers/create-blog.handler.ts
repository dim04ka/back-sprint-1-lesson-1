import { Request, Response } from 'express'
import { Blog } from '../../dto'
import { blogsRepository } from '../../repository'
import { HttpStatus } from '../../../core/types/http-statuses'

export const createBlogHandler = async (
    req: Request,
    res: Response
): Promise<void> => {

    const newBlog: Blog = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    }

    const createdBlog = await blogsRepository.create(newBlog)

    res.status(HttpStatus.Created).send(createdBlog)
}
