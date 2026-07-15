import { Router } from 'express'

import { Request, Response } from 'express'

import { HttpStatus } from '../core/types/http-statuses'
import {
    BlogModel,
    UserModel,
    CommentModel,
    PostModel,
    SessionModel,
    RaceLimitedRequestsModel,
} from '../db/mongo.db/schemes'

export const testingRouter = Router()

testingRouter.delete(
    '/all-data',
    async (_: Request, res: Response) => {
        console.log('Deleting all data...')

        await Promise.all([
            BlogModel.deleteMany({}),
            PostModel.deleteMany(),
            UserModel.deleteMany(),
            CommentModel.deleteMany(),
            RaceLimitedRequestsModel.deleteMany(),
            SessionModel.deleteMany(),
        ])
        debugger
        res.sendStatus(HttpStatus.NoContent)
    }
)
