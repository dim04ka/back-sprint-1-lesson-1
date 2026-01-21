import { Request, Response } from 'express'
import { CreatePost, PostViewModel } from '../../dto'

import { postsRepository } from '../../repository'
import { HttpStatus } from '../../../core/types/http-statuses'
import { blogsRepository } from '../../../blogs/repository/blogs.repository'

export const createPostHandler = async (
    req: Request,
    res: Response
) => {
    const { title, shortDescription, content, blogId } = req.body
    const blog = await blogsRepository.findById(blogId)
    if (!blog) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Blog not found' })
    }

    const newPost: CreatePost & { createdAt: string } = {
        title,
        shortDescription,
        content,
        blogId,
        createdAt: new Date().toISOString(),
    }

    const id = await postsRepository.create({ ...newPost })

    const postWithInfo: PostViewModel = {
        ...newPost,
        id,
        blogName: blog.name,
    }

    res.status(HttpStatus.Created).send(postWithInfo)
}
