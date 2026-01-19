import { Request, Response } from 'express'
import { blogsRepository } from '../../repository'
import { HttpStatus } from '../../../core/types/http-statuses'

export const getBlogHandler = async (req: Request, res: Response) => {
    const id = req.params.id
    const blog = await blogsRepository.findById(id)
    if (!blog) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Blog not found' })
    }
    res.status(HttpStatus.Ok).send(blog)
}
