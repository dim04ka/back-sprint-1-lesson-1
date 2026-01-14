import express, { Express, Response, Request } from 'express'
import { videosRouter } from './videos/routes'
import { setupSwagger } from './core/swagger'
import { API_VERSION, ROUTES } from './core/path'
import { blogsRouter } from './blogs/routes'
import { postsRouter } from './posts/routes'

export const setupApp = (app: Express) => {
    app.use(express.json())

    app.get('/', (_: Request, res: Response) => {
        res.status(200).send('Hello world!')
    })

    app.use(`${API_VERSION}/${ROUTES.VIDEOS}`, videosRouter)
    app.use(`${API_VERSION}/${ROUTES.BLOGS}`, blogsRouter)
    app.use(`${API_VERSION}/${ROUTES.POSTS}`, postsRouter)

    setupSwagger(app)

    return app
}
