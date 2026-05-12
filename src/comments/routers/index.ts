import { Router } from 'express'
import { NextFunction, Request, Response } from 'express'
import { commentsService } from '../service/comment.service'
// import { usersRepository } from '../../users/repository/users.repository'
import { accessTokenGuard } from '../../auth/routes/guard/access.token.guard'

import {
    commentContentValidation,
    commentIdValidation,
} from '../validation/comment.validation'
import { inputValidationResultMiddleware } from '../../core/middlewares/validation'
import { usersRepository } from '../../composition-root'
export const commentsRouter = Router()

const commentExistenceGuard = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const comment = await commentsService.findById(req.params.id)
        res.locals.comment = comment
        next()
    } catch (error) {
        res.status(404).send({ message: 'Comment not found' })
    }
}

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id as string

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
    commentExistenceGuard,
    async (req: Request<{ id: string }>, res: Response) => {
        const userId = req.user!.id
        const comment = res.locals.comment as Awaited<
            ReturnType<typeof commentsService.findById>
        >

        if (comment.userId !== userId) {
            return res.status(403).send({ message: 'Forbidden' })
        }

        await commentsService.delete(req.params.id)
        res.sendStatus(204)
    }
)

commentsRouter.put(
    '/:id',
    accessTokenGuard,
    commentIdValidation,
    inputValidationResultMiddleware,
    commentExistenceGuard,
    commentContentValidation,
    inputValidationResultMiddleware,
    async (req: Request<{ id: string }>, res: Response) => {
        const { content } = req.body
        const userId = req.user!.id
        const comment = res.locals.comment as Awaited<
            ReturnType<typeof commentsService.findById>
        >

        if (comment.userId !== userId) {
            return res.status(403).send({ message: 'Forbidden' })
        }

        await commentsService.updateComment(req.params.id, content)
        res.sendStatus(204)
    }
)
