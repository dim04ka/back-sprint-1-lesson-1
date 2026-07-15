import { Router } from 'express'
import { NextFunction, Request, Response } from 'express'
import {
    idValidation,
    inputValidationResultMiddleware,
    postIdValidation,
} from '../../core/middlewares/validation'

import { createPostValidationMiddleware } from './validate'
import { superAdminGuardMiddleware } from '../../core/middlewares/super-admin.guard-middleware'
import {
    getPostHandler,
    getPostListHandler,
    createPostHandler,
    updatePostHandler,
    deletePostHandler,
    createCommentHandler,
    getCommentsByPostIdHandler,
} from './handlers'

import { accessTokenGuard } from '../../auth/routes/guard/access.token.guard'
import { commentContentValidation } from '../../comments/validation/comment.validation'
import { postsService } from '../../composition-root'
export const postsRouter = Router()

const postByPostIdExistenceGuard = async (
    req: Request<{ postId: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        await postsService.findById(req.params.postId)
        next()
    } catch (error) {
        res.status(404).send({ message: 'Post not found' })
    }
}

postsRouter.get(
    '',
    inputValidationResultMiddleware,
    getPostListHandler
)
postsRouter.get(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    getPostHandler
)
postsRouter.post(
    '',
    superAdminGuardMiddleware,
    createPostValidationMiddleware,
    inputValidationResultMiddleware,
    createPostHandler
)
postsRouter.put(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    createPostValidationMiddleware,
    inputValidationResultMiddleware,
    updatePostHandler
)
postsRouter.delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deletePostHandler
)

postsRouter.post(
    '/:postId/comments',
    accessTokenGuard,
    postIdValidation,
    inputValidationResultMiddleware,
    postByPostIdExistenceGuard,
    commentContentValidation,
    inputValidationResultMiddleware,
    createCommentHandler
)

postsRouter.get(
    '/:postId/comments',
    postByPostIdExistenceGuard,
    getCommentsByPostIdHandler
)
