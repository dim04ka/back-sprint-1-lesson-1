import { Request, Response } from 'express'
import {
    commentsService,
    usersRepository,
} from '../../../composition-root'

import { DomainError } from '../../../core/errors/domain.error'
import { HttpStatus } from '../../../core/types/http-statuses'
import {
    Comment,
    CommentViewModel,
} from '../../../comments/types/comment'
import { postsService } from '../../../composition-root'

export const createCommentHandler = async (
    req: Request<{ postId: string }, {}, { content: string }, {}>,
    res: Response
) => {
    try {
        const postId = req.params.postId
        const { content } = req.body

        const userId = req.user!.id

        const comment: Comment = {
            postId,
            content,
            userId,
            createdAt: new Date().toISOString(),
        }

        const hasPost = await postsService.findById(postId)

        if (!hasPost) {
            return res.status(404).send({ message: 'Post not found' })
        }

        const commentId = await commentsService.createComment(comment)
        const user = await usersRepository.findById(userId)
        if (!user) {
            throw new DomainError(
                'User not found',
                'USER_NOT_FOUND',
                'user'
            )
        }
        const responseComment: CommentViewModel = {
            id: commentId,
            content,
            createdAt: comment.createdAt,
            commentatorInfo: {
                userId,
                userLogin: user.login,
            },
        }
        res.status(HttpStatus.Created).send(responseComment)
    } catch (error) {
        res.status(HttpStatus.NotFound).send({
            message: 'Post not found',
        })
    }
}
