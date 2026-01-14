import { Request, Response } from 'express'
import { blogsRepository } from '../../repository'
import { HttpStatus } from '../../../core/types/http-statuses'

export const getBlogListHandler = (_: Request, res: Response) => {
    const blogs = blogsRepository.findAll()
    res.status(HttpStatus.Ok).send(blogs)
}
