import { Router } from 'express'
import {
    idValidation,
    inputValidationResultMiddleware,
    paginationAndSortingValidation,
} from '../../core/middlewares/validation'
import { BlogSortFields } from './input/blog-sort.input'

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
    paginationAndSortingValidation(BlogSortFields),
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

blogsRouter.get(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    getBlogHandler
)

blogsRouter.post(
    '/:blogId/posts',
    createBlogPostValidationMiddleware,
    inputValidationResultMiddleware,
    createBlogPostHandler
)

blogsRouter.get(
    '/:blogId/posts',
    paginationAndSortingValidation(BlogSortFields),
    inputValidationResultMiddleware,
    getBlogPostListHandler
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
