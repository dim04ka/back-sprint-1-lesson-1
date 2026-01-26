import { Router } from 'express'
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
} from './handlers'

import { paginationAndSortingValidation } from '../../core/middlewares/validation'
import { PostSortFields } from './input/post-sort.input'
export const postsRouter = Router()

postsRouter.get(
    '',
    paginationAndSortingValidation(PostSortFields),
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
