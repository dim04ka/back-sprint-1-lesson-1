import { Router } from 'express'

import {
    getVideoListHandler,
    getVideoHandler,
    createVideoHandler,
    updateVideoHandler,
    deleteVideoHandler,
} from './handlers'
import {
    idValidation,
    inputValidationResultMiddleware,
    createVideoValidationMiddleware,
} from '../../core/middlewares/validation'
import { superAdminGuardMiddleware } from '../../core/middlewares/super-admin.guard-middleware'

export const videosRouter = Router({})

videosRouter.get('', getVideoListHandler)
videosRouter.get(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    getVideoHandler
)
videosRouter.post(
    '',
    superAdminGuardMiddleware,
    createVideoValidationMiddleware,
    inputValidationResultMiddleware,
    createVideoHandler
)
videosRouter.put('/:id', updateVideoHandler)
videosRouter.delete('/:id', deleteVideoHandler)
