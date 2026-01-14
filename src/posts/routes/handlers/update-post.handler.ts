import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { postsRepository } from '../../repository'
import { Post } from '../../dto'
import { blogsRepository } from '../../../blogs/repository'

export const updatePostHandler = (req: Request, res: Response) => {
    const id = req.params.id
    const post = postsRepository.findById(id)
    if (!post) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Post not found' })
    }
    const blog = blogsRepository.findById(req.body.blogId)
    if (!blog) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Blog not found' })
    }
    const updatedPost: Post = {
        ...post,
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: blog.name,
    }
    postsRepository.update(updatedPost)
    res.sendStatus(HttpStatus.NoContent)
}
