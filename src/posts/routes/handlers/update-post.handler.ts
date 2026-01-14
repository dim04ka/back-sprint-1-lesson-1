import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { postsRepository } from '../../repository'
import { Post } from '../../dto'

export const updatePostHandler = (req: Request, res: Response) => {
    const id = req.params.id
    const post = postsRepository.findById(id)
    if (!post) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Post not found' })
    }
    const updatedPost: Post = {
        ...post,
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: req.body.blogName,
    }
    postsRepository.update(updatedPost)
    res.status(HttpStatus.Ok).send(updatedPost)
}
