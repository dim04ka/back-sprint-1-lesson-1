import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { blogsRepository } from '../../repository'

export const deleteBlogHandler = async (req: Request, res: Response) => {
    const id = req.params.id
    const blog = await blogsRepository.findById(id)
    if (!blog) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Blog not found' })
    }
    await blogsRepository.delete(id)
    res.sendStatus(HttpStatus.NoContent)
}
