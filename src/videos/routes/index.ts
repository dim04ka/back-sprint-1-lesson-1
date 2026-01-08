import { Router } from 'express'

import {
    getVideoListHandler,
    getVideoHandler,
    createVideoHandler,
    updateVideoHandler,
    deleteVideoHandler,
} from './handlers'

export const videosRouter = Router({})

videosRouter.get('', getVideoListHandler)
videosRouter.get('/:id', getVideoHandler)
videosRouter.post('', createVideoHandler)
videosRouter.put('/:id', updateVideoHandler)
videosRouter.delete('/:id', deleteVideoHandler)
