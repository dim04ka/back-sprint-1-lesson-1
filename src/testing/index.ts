import { Router } from 'express'

import { Request, Response } from 'express'
import {
    blogsCollection,
    commentsCollection,
    usersCollection,
    refreshTokensCollection,
    sessionsCollection,
} from '../db/mongo.db'
import { postsCollection } from '../db/mongo.db'
import { HttpStatus } from '../core/types/http-statuses'

export const testingRouter = Router()

testingRouter.delete(
    '/all-data',
    async (_: Request, res: Response) => {
        await Promise.all([
            blogsCollection.deleteMany(),
            postsCollection.deleteMany(),
            usersCollection.deleteMany(),
            commentsCollection.deleteMany(),
            refreshTokensCollection.deleteMany(),
            sessionsCollection.deleteMany(),
        ])
        res.sendStatus(HttpStatus.NoContent)
    }
)
