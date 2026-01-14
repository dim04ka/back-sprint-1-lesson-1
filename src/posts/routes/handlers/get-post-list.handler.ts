import { Request, Response } from 'express'
import { postsRepository } from '../../repository'
import { HttpStatus } from '../../../core/types/http-statuses'

export const getPostListHandler = (_: Request, res: Response) => {
    const posts = postsRepository.findAll()
    res.status(HttpStatus.Ok).send(posts)
}
