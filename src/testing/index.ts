import { Router } from 'express'
import { db } from '../db'
import { Request, Response } from 'express'

export const testingRouter = Router()

testingRouter.delete('/all-data', (_: Request, res: Response) => {
    db.blogs = []
    db.posts = []
    res.sendStatus(204)
})
