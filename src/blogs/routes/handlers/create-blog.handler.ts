import { Request, Response } from 'express'
import { Blog, BlogViewModel } from '../../dto'
import { blogsRepository } from '../../repository'
import { HttpStatus } from '../../../core/types/http-statuses'

export const createBlogHandler = async (
    req: Request,
    res: Response
): Promise<void> => {

    const { name, description, websiteUrl } = req.body
    const newBlog: Blog = {
        name,
        description,
        websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership: true,
    }

    const { id } = await blogsRepository.create(newBlog)

    const responseBlog: BlogViewModel = {
        id,
        name,
        description,
        websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership: true,
    }

    res.status(HttpStatus.Created).send(responseBlog)
}
