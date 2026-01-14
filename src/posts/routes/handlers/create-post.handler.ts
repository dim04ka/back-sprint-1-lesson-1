import { Request, Response } from 'express'
import { Post } from '../../dto'
import { db } from '../../../db'
import { postsRepository } from '../../repository'
import { HttpStatus } from '../../../core/types/http-statuses'
import { blogsRepository } from '../../../blogs/repository'
import { CreatePost } from '../../dto'

export const createPostHandler = (req: Request, res: Response) => {
    const blog = blogsRepository.findById(req.body.blogId)
    if (!blog) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Blog not found' })
    }
    const lastPostId = db.posts.length
        ? db.posts[db.posts.length - 1].id + 1
        : 1
    const newPost: Post = {
        id: String(lastPostId),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: blog.name,
    }

    postsRepository.create(newPost)

    res.status(HttpStatus.Created).send(newPost)
}
