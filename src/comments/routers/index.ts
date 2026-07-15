import { Router } from 'express'
import { NextFunction, Request, Response } from 'express'
import { commentsService } from '../../composition-root'

import { accessTokenGuard } from '../../auth/routes/guard/access.token.guard'

import {
    commentContentValidation,
    commentIdValidation,
    commentLikeStatusValidation,
} from '../validation/comment.validation'
import { inputValidationResultMiddleware } from '../../core/middlewares/validation'
import {
    commentsGetHandler,
    commentsDeleteHandler,
    commentUpdateHandler,
    commentLikeStatusHandler,
} from './handlers'
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

commentsRouter.get('/:id', commentsGetHandler)

commentsRouter.delete(
    '/:id',
    accessTokenGuard,
    commentIdValidation,
    inputValidationResultMiddleware,
    commentExistenceGuard,
    commentsDeleteHandler
)

commentsRouter.put(
    '/:id',
    accessTokenGuard,
    commentIdValidation,
    inputValidationResultMiddleware,
    commentExistenceGuard,
    commentContentValidation,

    commentUpdateHandler
)

commentsRouter.put(
    '/:id/like-status',
    accessTokenGuard,
    commentLikeStatusValidation,
    inputValidationResultMiddleware,
    commentExistenceGuard,
    commentLikeStatusHandler
)
