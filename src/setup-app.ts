import express, { Express, Response, Request } from 'express'

import { setupSwagger } from './core/swagger'
import { ROUTES } from './core/path'
import { blogsRouter } from './blogs/routes'
import { postsRouter } from './posts/routes'
import { usersRouter } from './users/routers'
import { testingRouter } from './testing'
import { authRouter } from './auth/routes'
import { commentsRouter } from './comments/routers'
import cookieParser from 'cookie-parser'
import { securityDevicesRouter } from './securityDevices/routes'

export const setupApp = (app: Express) => {
    app.use(express.json())
    app.use(cookieParser())

    app.get('/', (_: Request, res: Response) => {
        res.status(200).send('Hello world!')
    })

    app.use(`${ROUTES.BLOGS}`, blogsRouter)
    app.use(`${ROUTES.POSTS}`, postsRouter)
    app.use(`${ROUTES.USERS}`, usersRouter)
    app.use(`${ROUTES.AUTH}`, authRouter)
    app.use(`${ROUTES.COMMENTS}`, commentsRouter)
    app.use(`${ROUTES.SECURITY_DEVICES}`, securityDevicesRouter)
    app.use(`${ROUTES.TESTING}`, testingRouter)

    setupSwagger(app)

    return app
}
