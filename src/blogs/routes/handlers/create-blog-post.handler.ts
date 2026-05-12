import { errorsHandler } from '../../../core/errors/errors.handler'
import { Request, Response } from 'express'
import { postService } from '../../../posts/application/post.service'
import { blogsService } from '../../application/blogs.service'
import { WithId } from 'mongodb'
import { Blog } from '../../domain'
import { HttpStatus } from '../../../core/types/http-statuses'
import { PostViewModel } from '../../../posts/dto'

export const createBlogPostHandler = async (
    req: Request<{ blogId: string }, {}, { title: string, shortDescription: string, content: string }>,
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

        const responsePost: PostViewModel = {
            id,
            title,
            shortDescription,
            content,
            blogId,
            createdAt,
            blogName: blog.name,
        }
        res.status(HttpStatus.Created).send(responsePost)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
