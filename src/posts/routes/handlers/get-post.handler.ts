import { Request, Response } from 'express'
import { postsRepository } from '../../repository'
import { HttpStatus } from '../../../core/types/http-statuses'

export const getPostHandler = async (req: Request, res: Response) => {
    const id = req.params.id
    const post = await postsRepository.findById(id)
    if (!post) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Post not found' })
    }
    res.status(HttpStatus.Ok).send(post)
}
