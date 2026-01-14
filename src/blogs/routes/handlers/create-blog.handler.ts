import { Request, Response } from 'express'
import { Blog } from '../../dto'
import { db } from '../../../db'
import { blogsRepository } from '../../repository'
import { HttpStatus } from '../../../core/types/http-statuses'

export const createBlogHandler = (req: Request, res: Response) => {
    const lastBlogId = db.blogs.length
        ? db.blogs[db.blogs.length - 1].id + 1
        : 1
    const newBlog: Blog = {
        id: String(lastBlogId),
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    }

    blogsRepository.create(newBlog)

    res.status(HttpStatus.Created).send(newBlog)
}
