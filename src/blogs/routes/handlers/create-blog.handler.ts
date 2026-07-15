import { Request, Response } from 'express'
import { Blog, BlogViewModel } from '../../domain'
import { HttpStatus } from '../../../core/types/http-statuses'
import { blogsService } from '../../../composition-root'
import { errorsHandler } from '../../../core/errors/errors.handler'

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

    try {
        const { id } = await blogsService.create(newBlog)

        const responseBlog: BlogViewModel = {
            id,
            name,
            description,
            websiteUrl,
            ...additionalBlogData,
        }

        res.status(HttpStatus.Created).send(responseBlog)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
