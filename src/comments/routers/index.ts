import { Router } from 'express'
import { Request, Response } from 'express'
import { commentsService } from '../service/comment.service'
import { usersRepository } from '../../users/repository/users.repository'
import { accessTokenGuard } from '../../auth/routes/guard/access.token.guard'
import {
    commentContentValidation,
    commentIdValidation,
} from '../validation/comment.validation'
import { inputValidationResultMiddleware } from '../../core/middlewares/validation'

export const commentsRouter = Router()

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const comment = await commentsService.findById(id)
        const user = await usersRepository.findById(comment!.userId)

        const commentOutput = {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.userId,
                userLogin: user?.login ?? '',
            },
            createdAt: comment.createdAt,
        }

        res.status(200).send(commentOutput)
    } catch (error) {
        res.status(404).send({ message: 'Comment not found' })
    }
})

commentsRouter.delete(
    '/:id',
    accessTokenGuard,
    commentIdValidation,
    inputValidationResultMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const userId = req.user!.id
            const comment = await commentsService.findById(id)
            if (comment!.userId !== userId) {
                return res.status(403).send({ message: 'Forbidden' })
            }
            await commentsService.delete(id)
            res.sendStatus(204)
        } catch (error) {
            res.status(404).send({ message: 'Comment not found' })
        }
    }
)

commentsRouter.put(
    '/:id',
    accessTokenGuard,
    commentIdValidation,
    commentContentValidation,
    inputValidationResultMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const { content } = req.body
            const userId = req.user!.id

            const comment = await commentsService.findById(id)
            if (!comment) {
                return res
                    .status(404)
                    .send({ message: 'Comment not found' })
            }
            if (comment!.userId !== userId) {
                return res.status(403).send({ message: 'Forbidden' })
            }
            await commentsService.updateComment(id, content)
            res.sendStatus(204)
        } catch (error) {
            res.status(400).send({ message: 'Invalid comment' })
        }
    }
)
