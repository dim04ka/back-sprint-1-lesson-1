import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { blogsRepository } from '../../repository/blogs.repository'
import { Blog } from '../../domain'

export const updateBlogHandler = async (
    req: Request,
    res: Response
) => {
    const id = req.params.id
    const blog = await blogsRepository.findById(id)
    if (!blog) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Blog not found' })
    }

    const { name, description, websiteUrl } = req.body
    const updatedBlog: Blog = {
        name,
        description,
        websiteUrl,
    }
    await blogsRepository.update({ id, blog: updatedBlog })
    res.sendStatus(HttpStatus.NoContent)
}
