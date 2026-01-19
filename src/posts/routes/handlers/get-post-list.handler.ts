import { Request, Response } from 'express'
import { postsRepository } from '../../repository'
import { HttpStatus } from '../../../core/types/http-statuses'
import { PostViewModel } from '../../dto'
import { postViewModelMapper } from '../../mapper'
import { blogsRepository } from '../../../blogs/repository'

export const getPostListHandler = async(_: Request, res: Response) => {
    const posts = await postsRepository.findAll()
    if (!posts) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Posts not found' })
    }
    const blogs = await blogsRepository.findAll()
    if (!blogs) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Blogs not found' })
    }
    const postsWithBlogName: PostViewModel[] = posts.map(post => {
        const blog = blogs.find(blog => blog._id.toString() === post.blogId)
        if (!blog) {    
            return undefined
        }
        return postViewModelMapper(post, blog!)
    }).filter(post => post !== undefined)
    res.status(HttpStatus.Ok).send(postsWithBlogName)
}
