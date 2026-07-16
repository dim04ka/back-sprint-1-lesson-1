import { commentsService } from '../../../composition-root'
import { HttpStatus } from '../../../core/types/http-statuses'
import { SortDirection } from '../../../core/types/sort-direction'
import { Request, Response } from 'express'
import { PostQueryInput } from '../input/post-query.input'
import { PostSortFields } from '../input/post-sort.input'
import { getUserIdFromToken } from '../../../core/helpers/getUserIdFromToken'

export const getCommentsByPostIdHandler = async (
    req: Request<{ postId: string }, {}, {}, Partial<PostQueryInput>>,
    res: Response
) => {
    try {
        const { postId } = req.params
        const token = req.headers.authorization?.split(' ')[1]
        let requestedUserId = null
        if (token) {
            requestedUserId = await getUserIdFromToken(token)
        }

        const queryInput: PostQueryInput = {
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            sortBy:
                (req.query.sortBy as PostSortFields) ??
                PostSortFields.CreatedAt,
            sortDirection:
                (req.query.sortDirection as SortDirection) ??
                SortDirection.Desc,
        }

        const { items, totalCount } =
            await commentsService.getCommentsByPostId({
                postId,
                queryDto: queryInput,
                requestedUserId,
            })

        const result = {
            items,
            page: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            pagesCount: Math.ceil(totalCount / queryInput.pageSize),
            totalCount,
        }

        res.status(HttpStatus.Ok).send(result)
    } catch (error) {
        res.status(HttpStatus.NotFound).send({
            message: 'Comments not found',
        })
    }
}
