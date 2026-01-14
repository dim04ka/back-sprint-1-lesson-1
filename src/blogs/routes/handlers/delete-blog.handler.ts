import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { blogsRepository } from '../../repository'

export const deleteBlogHandler = (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const blog = blogsRepository.findById(id)
    if (!blog) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Blog not found' })
    }
    blogsRepository.delete(id)
    res.sendStatus(HttpStatus.NoContent)
}
