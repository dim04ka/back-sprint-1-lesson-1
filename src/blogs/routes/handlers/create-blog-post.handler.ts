import { errorsHandler } from '../../../core/errors/errors.handler'
import { Request, Response } from 'express'
import { postsService } from '../../../composition-root'
import { blogsService } from '../../../composition-root'
import { WithId } from 'mongodb'
import { Blog } from '../../domain'
import { HttpStatus } from '../../../core/types/http-statuses'
import { PostViewModel } from '../../../posts/dto'
import { getExtendedLikesInfo } from '../../../posts/routes/helpers/get-extended-likes-info'

export const createBlogPostHandler = async (
    req: Request<
        { blogId: string },
        {},
        { title: string; shortDescription: string; content: string }
    >,
    res: Response
) => {
    try {
        const blogId = req.params.blogId
        const { title, shortDescription, content } = req.body

        const blog: WithId<Blog> = await blogsService.findById(blogId)

        const createdAt = new Date().toISOString()
        const { id } = await postsService.create({
            title,
            shortDescription,
            content,
            blogId,
            createdAt,
        })

        const responsePost: PostViewModel = {
            id,
            title,
            shortDescription,
            content,
            blogId,
            createdAt,
            blogName: blog.name,
            extendedLikesInfo: await getExtendedLikesInfo(
                id,
                null
            ),
        }
        res.status(HttpStatus.Created).send(responsePost)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
