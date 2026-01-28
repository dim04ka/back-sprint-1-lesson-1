import { Request, Response } from 'express'

import { HttpStatus } from '../../../core/types/http-statuses'

import { PostQueryInput } from '../input/post-query.input'
import { matchedData } from 'express-validator'
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination'
import { postService } from '../../application/post.service'

import { mapToPostListPaginatedOutput } from '../mapper/map-to-post-list-paginated-output'
import { errorsHandler } from '../../../core/errors/errors.handler'

export const getPostListHandler = async (
    req: Request<{}, {}, {}, PostQueryInput>,
    res: Response
) => {
    try {
        // const sanitizedQuery = matchedData<PostQueryInput>(req, {
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
        }

        const { items, totalCount } =
            await postService.findManyWithBlogName(queryInput)

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
