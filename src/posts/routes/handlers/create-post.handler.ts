import { Request, Response } from 'express'
import { FullPost, Post } from '../../dto'

import { postsRepository } from '../../repository'
import { HttpStatus } from '../../../core/types/http-statuses'
import { blogsRepository } from '../../../blogs/repository'

import { WithId } from 'mongodb'

export const createPostHandler = async (req: Request, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body
    const blog = await blogsRepository.findById(blogId)
    if (!blog) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Blog not found' })
    }

    const newPost: Post = {
        title,
        shortDescription,
        content,
        blogId,
    }

    const createdPost: WithId< { createdAt: string }>  = await postsRepository.create(newPost)


    const postWithInfo: FullPost = {
        id: createdPost._id.toString(),
        title: newPost.title,
        shortDescription: newPost.shortDescription,
        content: newPost.content,
        blogId: newPost.blogId,
        blogName: blog.name,
        createdAt: createdPost.createdAt,
    }
    res.status(HttpStatus.Created).send(postWithInfo)
}
