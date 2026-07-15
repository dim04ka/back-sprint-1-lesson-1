import { Router } from 'express'
import {
    idValidation,
    blogIdValidation,
    inputValidationResultMiddleware,
} from '../../core/middlewares/validation'

import { createBlogValidationMiddleware } from './input/blog-create.input-dto.validation-middlewares'
import { createBlogPostValidationMiddleware } from './input/blog-post.input-dto.validation-middleware'
import { updateBlogValidationMiddleware } from './input/blog-update.input-dto.validation-middlewares'
import { superAdminGuardMiddleware } from '../../core/middlewares/super-admin.guard-middleware'
import {
    getBlogHandler,
    getBlogListHandler,
    createBlogHandler,
    updateBlogHandler,
    deleteBlogHandler,
    createBlogPostHandler,
    getBlogPostListHandler,
} from './handlers'

export const blogsRouter = Router()

blogsRouter.get(
    '',
    inputValidationResultMiddleware,
    getBlogListHandler
)

blogsRouter.post(
    '',
    superAdminGuardMiddleware,
    createBlogValidationMiddleware,
    inputValidationResultMiddleware,
    createBlogHandler
)

blogsRouter.post(
    '/:blogId/posts',
    superAdminGuardMiddleware,
    createBlogPostValidationMiddleware,
    inputValidationResultMiddleware,
    createBlogPostHandler
)

blogsRouter.get(
    '/:blogId/posts',
    blogIdValidation,
    inputValidationResultMiddleware,
    getBlogPostListHandler
)

blogsRouter.get(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    getBlogHandler
)

blogsRouter.put(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    updateBlogValidationMiddleware,
    inputValidationResultMiddleware,
    updateBlogHandler
)
blogsRouter.delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogHandler
)
