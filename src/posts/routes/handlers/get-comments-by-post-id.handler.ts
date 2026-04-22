import { commentsService } from '../../../comments/service/comment.service'
import { HttpStatus } from '../../../core/types/http-statuses'
import { Request, Response } from 'express'
import { PostQueryInput } from '../input/post-query.input'

export const getCommentsByPostIdHandler = async (
    req: Request<{ postId: string }, {}, {}, PostQueryInput>,
    res: Response
) => {
    try {
        const { postId } = req.params

        const queryInput = {
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            sortBy: req.query.sortBy || 'createdAt',
            sortDirection: req.query.sortDirection || 'desc',
        }

        const { items, totalCount } =
            await commentsService.getCommentsByPostId({
                postId,
                queryDto: queryInput,
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
