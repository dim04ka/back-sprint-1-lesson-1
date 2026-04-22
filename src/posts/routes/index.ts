import { Router } from 'express'
import {
    idValidation,
    inputValidationResultMiddleware,
} from '../../core/middlewares/validation'

import {
    contentCommentValidation,
    createPostValidationMiddleware,
} from './validate'
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
export const postsRouter = Router()

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
    contentCommentValidation,
    createCommentHandler
)

postsRouter.get('/:postId/comments', getCommentsByPostIdHandler)
