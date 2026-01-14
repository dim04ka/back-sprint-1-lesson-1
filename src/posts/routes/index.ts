import { Router } from 'express'
import {
    idValidation,
    inputValidationResultMiddleware,
} from '../../core/middlewares/validation'

import { createBlogValidationMiddleware } from './validate'
import { superAdminGuardMiddleware } from '../../core/middlewares/super-admin.guard-middleware'
import {
    getPostHandler,
    getPostListHandler,
    createPostHandler,
    updatePostHandler,
    deletePostHandler,
} from './handlers'

export const postsRouter = Router()

postsRouter.get('', getPostListHandler)
postsRouter.get(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    getPostHandler
)
postsRouter.post(
    '',
    superAdminGuardMiddleware,
    createBlogValidationMiddleware,
    inputValidationResultMiddleware,
    createPostHandler
)
postsRouter.put(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
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
