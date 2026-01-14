import { Request, Response } from 'express'
import { HttpStatus } from "../../../core/types/http-statuses"
import { blogsRepository } from "../../repository"
import { Blog } from '../../dto'

export const updateBlogHandler = (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const blog = blogsRepository.findById(id)
    if (!blog) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Blog not found' })
    }
    const updatedBlog: Blog = {
        ...blog,
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    }
    blogsRepository.update(updatedBlog)
    res.status(HttpStatus.Ok).send(updatedBlog)
}