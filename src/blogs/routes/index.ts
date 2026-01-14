import { Router } from 'express'
import {
    idValidation,
    inputValidationResultMiddleware,
} from '../../core/middlewares/validation'

import { createBlogValidationMiddleware } from './validate'
import { superAdminGuardMiddleware } from '../../core/middlewares/super-admin.guard-middleware'
import {
    getBlogHandler,
    getBlogListHandler,
    createBlogHandler,
    updateBlogHandler,
    deleteBlogHandler,
} from './handlers'

export const blogsRouter = Router()

blogsRouter.get('', getBlogListHandler)
blogsRouter.get(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    getBlogHandler
)
blogsRouter.post(
    '',
    superAdminGuardMiddleware,
    createBlogValidationMiddleware,
    inputValidationResultMiddleware,
    createBlogHandler
)
blogsRouter.put(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
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
