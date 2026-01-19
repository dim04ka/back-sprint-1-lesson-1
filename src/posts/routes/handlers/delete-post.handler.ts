import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { postsRepository } from '../../repository'

export const deletePostHandler = async (req: Request, res: Response) => {
    const id = req.params.id
    const post = await postsRepository.findById(id)
    if (!post) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Post not found' })
    }
    await postsRepository.delete(id)
    res.sendStatus(HttpStatus.NoContent)
}
