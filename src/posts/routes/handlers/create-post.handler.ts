import { Request, Response } from 'express'
import { CreatePost, PostViewModel } from '../../dto'

import { HttpStatus } from '../../../core/types/http-statuses'
import { blogsService } from '../../../blogs/application/blogs.service'
import { postService } from '../../application/post.service'
import { errorsHandler } from '../../../core/errors/errors.handler'

export const createPostHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const { title, shortDescription, content, blogId } = req.body
        const blog = await blogsService.findById(blogId)

        const newPost: CreatePost & { createdAt: string } = {
            title,
            shortDescription,
            content,
            blogId,
            createdAt: new Date().toISOString(),
        }

        const { id } = await postService.create(newPost)

        const postWithInfo: PostViewModel = {
            ...newPost,
            id,
            blogName: blog.name,
        }

        res.status(HttpStatus.Created).send(postWithInfo)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
