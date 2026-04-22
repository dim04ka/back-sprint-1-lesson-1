import { Router } from 'express'
import { NextFunction, Request, Response } from 'express'
import {
    idValidation,
    inputValidationResultMiddleware,
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

import { paginationAndSortingValidation } from '../../core/middlewares/validation'
import { PostSortFields } from './input/post-sort.input'
import { accessTokenGuard } from '../../auth/routes/guard/access.token.guard'
import { commentContentValidation } from '../../comments/validation/comment.validation'
import { postsRepository } from '../repository'
export const postsRouter = Router()

const postByIdExistenceGuard = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        await postsRepository.findById(req.params.id)
        next()
    } catch (error) {
        res.status(404).send({ message: 'Post not found' })
    }
}

const postByPostIdExistenceGuard = async (
    req: Request<{ postId: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        await postsRepository.findById(req.params.postId)
        next()
    } catch (error) {
        res.status(404).send({ message: 'Post not found' })
    }
}

postsRouter.get(
    '',
    // paginationAndSortingValidation(PostSortFields),
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
    '/:id/comments',
    accessTokenGuard,
    idValidation,
    inputValidationResultMiddleware,
    postByIdExistenceGuard,
    commentContentValidation,
    inputValidationResultMiddleware,
    createCommentHandler
)

postsRouter.get(
    '/:postId/comments',
    postByPostIdExistenceGuard,
    getCommentsByPostIdHandler
)
