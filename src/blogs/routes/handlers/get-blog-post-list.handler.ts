import { errorsHandler } from '../../../core/errors/errors.handler'
import { Request, Response } from 'express'
import { BlogPostQueryInput } from '../input/blog-query.input'

import { postsService } from '../../../composition-root'
import { HttpStatus } from '../../../core/types/http-statuses'
import { PostQueryInput } from '../../../posts/routes/input/post-query.input'
import { mapToPostListPaginatedOutput } from '../../../posts/routes/mapper/map-to-post-list-paginated-output'
import { blogsService } from '../../../composition-root'

export const getBlogPostListHandler = async (
    req: Request<{ blogId: string }, {}, {}, BlogPostQueryInput>,
    res: Response
) => {
    try {
        const blogId = req.params.blogId

        const queryInput = {
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            sortBy: req.query.sortBy || 'createdAt',
            sortDirection: req.query.sortDirection || 'desc',
        }

        await blogsService.findById(blogId)

        const { items, totalCount } =
            await postsService.findManyWithBlogName({
                ...(queryInput as PostQueryInput),
                blogId,
            })

        const responseItems = items.map((item) => ({
            id: item._id.toString(),
            title: item.title,
            shortDescription: item.shortDescription,
            content: item.content,
            blogId: item.blogId,
            blogName: item.blogName,
            createdAt: item.createdAt,
        }))

        const postListOutput = mapToPostListPaginatedOutput(
            responseItems,
            {
                pageNumber: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount,
            }
        )

        res.status(HttpStatus.Ok).send({
            items: postListOutput.items,
            ...postListOutput.meta,
        })
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
