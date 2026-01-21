import { Request, Response } from 'express'
import { Blog, BlogViewModel } from '../../domain'
import { blogsRepository } from '../../repository/blogs.repository'
import { HttpStatus } from '../../../core/types/http-statuses'

export const createBlogHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { name, description, websiteUrl } = req.body

    const additionalBlogData = {
        createdAt: new Date().toISOString(),
        isMembership: false,
    }
    const newBlog: Blog = {
        name,
        description,
        websiteUrl,
        ...additionalBlogData,
    }

    const { id } = await blogsRepository.create(newBlog)

    const responseBlog: BlogViewModel = {
        id,
        name,
        description,
        websiteUrl,
        ...additionalBlogData,
    }

    res.status(HttpStatus.Created).send(responseBlog)
}
