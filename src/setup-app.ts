import express, { Express, Response, Request } from 'express'
import { videosRouter, testingRouter } from './routes'

export const setupApp = (app: Express) => {
    app.use(express.json())

    app.get('/', (_: Request, res: Response) => {
        res.status(200).send('Hello world!')
    })

    app.use('/videos', videosRouter)
    app.use('/testing', testingRouter)
}
