import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { blogsService } from '../../application/blogs.service'
import { BlogQueryInput } from '../input/blog-query.input'
import { matchedData } from 'express-validator'
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination'
import { mapToBlogListPaginatedOutput } from '../mapper/map-to-blog-list-paginated-output.util'

export const getBlogListHandler = async (
    req: Request<{}, {}, {}, BlogQueryInput>,
    res: Response
) => {
    try {
        const sanitizedQuery = matchedData<BlogQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        })

        const queryInput =
            setDefaultSortAndPaginationIfNotExist(sanitizedQuery)

        const { items, totalCount } =
            await blogsService.findMany(queryInput)

        const blogListOutput = mapToBlogListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        })

        res.status(HttpStatus.Ok).send(blogListOutput)
    } catch (error) {
        return res
            .status(HttpStatus.InternalServerError)
            .send({ message: 'Internal server error' })
    }
}
