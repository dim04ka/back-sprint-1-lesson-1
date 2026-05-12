import { Request, Response } from 'express'
import { commentsService } from '../../../comments/service/comment.service'
import {
    Comment,
    CommentViewModel,
} from '../../../comments/types/comment'
// import { usersRepository } from '../../../users/repository/users.repository'
import { usersRepository } from '../../../composition-root'
import { DomainError } from '../../../core/errors/domain.error'
import { postsRepository } from '../../repository'
import { HttpStatus } from '../../../core/types/http-statuses'

export const createCommentHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const id: string = req.params.id as string
        const { content } = req.body

        const userId= req.user!.id

        const comment: Comment = {
            postId: id as string,
            content,
            userId,
            createdAt: new Date().toISOString(),
        }

        const hasPost = await postsRepository.findById(id)

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
