import { Request, Response } from 'express'

import { HttpStatus } from '../../../core/types/http-statuses'

import { PostQueryInput } from '../input/post-query.input'

import { postsService } from '../../../composition-root'

import { mapToPostListPaginatedOutput } from '../mapper/map-to-post-list-paginated-output'
import { errorsHandler } from '../../../core/errors/errors.handler'
import { getUserIdFromToken } from '../../../core/helpers/getUserIdFromToken'
import { getExtendedLikesInfo } from '../helpers/get-extended-likes-info'

export const getPostListHandler = async (
    req: Request<{}, {}, {}, PostQueryInput>,
    res: Response
) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        const requestedUserId = token
            ? await getUserIdFromToken(token)
            : null

        const queryInput = {
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            sortBy: req.query.sortBy || 'createdAt',
            sortDirection: req.query.sortDirection || 'desc',
        }

        const { items, totalCount } =
            await postsService.findManyWithBlogName(queryInput)

        const responseItems = await Promise.all(
            items.map(async (item) => ({
                id: item._id.toString(),
                title: item.title,
                shortDescription: item.shortDescription,
                content: item.content,
                blogId: item.blogId,
                blogName: item.blogName,
                createdAt: item.createdAt,
                extendedLikesInfo: await getExtendedLikesInfo(
                    item._id.toString(),
                    requestedUserId
                ),
            }))
        )

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
