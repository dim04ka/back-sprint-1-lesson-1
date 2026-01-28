import { Router } from 'express'
import {
    idValidation,
    blogIdValidation,
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
import { searchNameTermValidation } from './input/blog-query.validation-middleware'
import { PostSortFields } from '../../posts/routes/input/post-sort.input'

export const blogsRouter = Router()

blogsRouter.get(
    '',
    // searchNameTermValidation,
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

blogsRouter.post(
    '/:blogId/posts',
    superAdminGuardMiddleware,
    createBlogPostValidationMiddleware,
    inputValidationResultMiddleware,
    createBlogPostHandler
)

blogsRouter.get(
    '/:blogId/posts',
    // blogIdValidation,
    // paginationAndSortingValidation(PostSortFields),
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
