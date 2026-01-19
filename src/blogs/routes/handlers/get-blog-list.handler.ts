import { Request, Response } from 'express'
import { blogsRepository } from '../../repository'
import { HttpStatus } from '../../../core/types/http-statuses'

export const getBlogListHandler = async (
    _: Request,
    res: Response
) => {
    const blogs = await blogsRepository.findAll()
    if (!blogs) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Blogs not found' })
    }
    res.status(HttpStatus.Ok).send(blogs)
}
