import { commentsService } from '../../../comments/service/comment.service'
import { HttpStatus } from '../../../core/types/http-statuses'
import { Request, Response } from 'express'
import { PostQueryInput } from '../input/post-query.input'
import { CommentViewModel } from '../../../comments/types/comment'
import { mapToPaginatedOutput } from '../../../core/utils/mappers'

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

        const commentsOutput = mapToPaginatedOutput<CommentViewModel>(
            items,
            {
                pageNumber: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount,
            }
        )

        res.status(HttpStatus.Ok).send(commentsOutput)
    } catch (error) {
        res.status(HttpStatus.NotFound).send({
            message: 'Comments not found',
        })
    }
}
