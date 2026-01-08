import express, { Express, Response, Request } from 'express'
import { videosRouter } from './videos/routes'
import { setupSwagger } from './core/swagger'
import { API_VERSION, ROUTES } from './core/path'

export const setupApp = (app: Express) => {
    app.use(express.json())

    app.get('/', (_: Request, res: Response) => {
        res.status(200).send('Hello world!')
    })

    app.use(`${API_VERSION}/${ROUTES.VIDEOS}`, videosRouter)

    setupSwagger(app)

    return app
}
