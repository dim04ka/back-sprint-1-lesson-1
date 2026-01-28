import { errorsHandler } from '../../../core/errors/errors.handler'
import { Request, Response } from 'express'
import { BlogPostQueryInput } from '../input/blog-query.input'
import { matchedData } from 'express-validator'
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination'
import { postService } from '../../../posts/application/post.service'
import { HttpStatus } from '../../../core/types/http-statuses'
import { PostQueryInput } from '../../../posts/routes/input/post-query.input'
import { mapToPostListPaginatedOutput } from '../../../posts/routes/mapper/map-to-post-list-paginated-output'
import { blogsService } from '../../application/blogs.service'

export const getBlogPostListHandler = async (
    req: Request<{ blogId: string }, {}, {}, BlogPostQueryInput>,
    res: Response
) => {
    try {
        const blogId = req.params.blogId

        const sanitizedQuery = matchedData<BlogPostQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        })
        await blogsService.findById(blogId)

        const queryInput = setDefaultSortAndPaginationIfNotExist({
            ...sanitizedQuery,
        })

        const { items, totalCount } =
            await postService.findManyWithBlogName({
                ...(queryInput as PostQueryInput),
                blogId,
            })

        const postListOutput = mapToPostListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        })

        res.status(HttpStatus.Ok).send({
            items: postListOutput.items,
            ...postListOutput.meta,
        })
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
