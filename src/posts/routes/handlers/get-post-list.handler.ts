import { Request, Response } from 'express'
import { postsRepository } from '../../repository'
import { HttpStatus } from '../../../core/types/http-statuses'

export const getPostListHandler = async(_: Request, res: Response) => {
    const posts = await postsRepository.findAll()
    if (!posts) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Posts not found' })
    }
    res.status(HttpStatus.Ok).send(posts)
}
