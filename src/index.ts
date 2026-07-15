import express, { Express } from 'express'
import { setupApp } from './setup-app'
import { runDB } from './db/mongo.db'

import dotenv from 'dotenv'
dotenv.config()

let app: Express | null = null
let isInitialized = false

const bootstrap = async (): Promise<Express> => {
    if (app && isInitialized) {
        return app
    }

    app = express()
    app.set('trust proxy', true)

    setupApp(app)

    await runDB()

    isInitialized = true

    // запуск сервера для локальной разработки (не на Vercel)
    if (
        process.env.NODE_ENV !== 'production' ||
        !process.env.VERCEL
    ) {
        const PORT = process.env.PORT || 5001
        app.listen(PORT, () => {
            console.log(`Example app listening on port ${PORT}`)
        })
    }

    return app
}

// Экспорт для Vercel serverless функции
export default async (
    req: express.Request,
    res: express.Response
) => {
    const initializedApp = await bootstrap()
    return initializedApp(req, res)
}

// Для локальной разработки
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    bootstrap()
}
