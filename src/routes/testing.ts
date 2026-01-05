import { Router, Request, Response } from 'express'
import { db } from '../db'
import { HttpStatus } from '../types'

export const testingRouter = Router({})

testingRouter.delete('/all-data', (_: Request, res: Response) => {
    db.videos = []
    res.sendStatus(HttpStatus.NoContent)
})
