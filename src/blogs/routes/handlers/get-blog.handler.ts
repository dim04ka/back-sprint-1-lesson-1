import { Request, Response } from 'express'
import { blogsRepository } from '../../repository'
import { HttpStatus } from '../../../core/types/http-statuses'
import { BlogViewModel } from '../../dto'
import { blogViewModelMapper } from '../mapper'

export const getBlogHandler = async (req: Request, res: Response) => {
    const id = req.params.id
    const blog = await blogsRepository.findById(id)
    if (!blog) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Blog not found' })
    }
    const blogViewModel: BlogViewModel = blogViewModelMapper(blog)
    res.status(HttpStatus.Ok).send(blogViewModel)
}
