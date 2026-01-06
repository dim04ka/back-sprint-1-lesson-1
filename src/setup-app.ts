import express, { Express, Response, Request } from 'express'
import { videosRouter, testingRouter } from './routes'
import { setupSwagger } from './core/swagger'

export const setupApp = (app: Express) => {
    app.use(express.json())

    app.get('/', (_: Request, res: Response) => {
        res.status(200).send('Hello world!')
    })

    app.use('/api/videos', videosRouter)
    app.use('/api/testing', testingRouter)

    setupSwagger(app)

    return app
}
