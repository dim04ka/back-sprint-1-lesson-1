import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { blogsService } from '../../application/blogs.service'
import { BlogQueryInput } from '../input/blog-query.input'
import { matchedData } from 'express-validator'
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination'
import { mapToBlogListPaginatedOutput } from '../mapper/map-to-blog-list-paginated-output.util'
import { errorsHandler } from '../../../core/errors/errors.handler'

export const getBlogListHandler = async (
    req: Request<{}, {}, {}, BlogQueryInput>,
    res: Response
) => {
    try {
        // const sanitizedQuery = matchedData<BlogQueryInput>(req, {
        //     locations: ['query'],
        //     includeOptionals: true,
        // })

        // const queryInput =
        //     setDefaultSortAndPaginationIfNotExist(sanitizedQuery)

        const queryInput = {
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            sortBy: req.query.sortBy || 'createdAt',
            sortDirection: req.query.sortDirection || 'desc',
            searchNameTerm: req.query.searchNameTerm || '',
        }

        const { items, totalCount } =
            await blogsService.findMany(queryInput)

        const blogListOutput = mapToBlogListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        })

        res.status(HttpStatus.Ok).send({
            items: blogListOutput.data,
            ...blogListOutput.meta,
        })
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
