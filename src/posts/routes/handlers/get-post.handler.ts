import { Request, Response } from 'express'
import { postsRepository } from '../../repository'
import { HttpStatus } from '../../../core/types/http-statuses'
import { blogsRepository } from '../../../blogs/repository'
import { postViewModelMapper } from '../../mapper'
import { PostViewModel } from '../../dto'

export const getPostHandler = async (req: Request, res: Response) => {
    const id = req.params.id
    const post = await postsRepository.findById(id)
    if (!post) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Post not found' })
    }
    const blog = await blogsRepository.findById(post.blogId)
    if (!blog) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Blog not found' })
    }
    const postViewModel: PostViewModel = postViewModelMapper(post, blog)
    console.log('postViewModel', postViewModel)
    res.status(HttpStatus.Ok).send(postViewModel)
}
