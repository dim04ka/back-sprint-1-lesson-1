import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { postsRepository } from '../../repository'

export const deletePostHandler = (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const post = postsRepository.findById(id)
    if (!post) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Post not found' })
    }
    postsRepository.delete(id)
    res.sendStatus(HttpStatus.NoContent)
}
