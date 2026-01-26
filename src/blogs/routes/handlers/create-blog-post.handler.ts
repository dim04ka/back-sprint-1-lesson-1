import { errorsHandler } from '../../../core/errors/errors.handler'
import { Request, Response } from 'express'
import { postService } from '../../../posts/application/post.service'
import { blogsService } from '../../application/blogs.service'
import { WithId } from 'mongodb'
import { Blog } from '../../domain'
import { HttpStatus } from '../../../core/types/http-statuses'

export const createBlogPostHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const blogId = req.params.blogId
        const { title, shortDescription, content } = req.body

        const blog: WithId<Blog> = await blogsService.findById(blogId)

        const createdAt = new Date().toISOString()
        const { id } = await postService.create({
            title,
            shortDescription,
            content,
            blogId,
            createdAt,
        })
        res.status(HttpStatus.Created).send({
            id,
            title,
            shortDescription,
            content,
            blogId,
            createdAt,
            blogName: blog.name,
        })
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
