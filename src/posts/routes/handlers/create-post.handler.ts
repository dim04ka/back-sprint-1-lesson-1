import { Request, Response } from 'express'
import { CreatePost, PostViewModel } from '../../dto'

import { HttpStatus } from '../../../core/types/http-statuses'
import { blogsService, postsService } from '../../../composition-root'
import { errorsHandler } from '../../../core/errors/errors.handler'

export const createPostHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const { title, shortDescription, content, blogId } = req.body
        const blog = await blogsService.findById(blogId)

        const createdAt = new Date().toISOString()

        const newPost: CreatePost & { createdAt: string } = {
            title,
            shortDescription,
            content,
            blogId,
            createdAt,
        }

        const { id } = await postsService.create(newPost)

        const postWithInfo: PostViewModel = {
            id,
            title,
            shortDescription,
            content,
            blogId,
            createdAt,
            blogName: blog.name,
        }

        res.status(HttpStatus.Created).send(postWithInfo)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
