import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { postsRepository } from '../../repository'
import { CreatePost } from '../../dto'
import { blogsRepository } from '../../../blogs/repository/blogs.repository'

export const updatePostHandler = async (
    req: Request,
    res: Response
) => {
    const id = req.params.id
    const post = await postsRepository.findById(id)
    if (!post) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Post not found' })
    }
    const blog = await blogsRepository.findById(req.body.blogId)
    if (!blog) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Blog not found' })
    }

    const { title, shortDescription, content, blogId } = req.body
    const updatedPost: CreatePost = {
        title,
        shortDescription,
        content,
        blogId,
    }
    await postsRepository.update({ id, post: updatedPost })
    res.sendStatus(HttpStatus.NoContent)
}
