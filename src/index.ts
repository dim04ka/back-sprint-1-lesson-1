import express from 'express'
import { setupApp } from './setup-app'
import { runDB } from './db/mongo.db'

import dotenv from 'dotenv'
dotenv.config()

const bootstrap = async () => {
    const app = express()

    setupApp(app)

    await runDB(
        process.env.MONGO_CONNECT_URL || ''
    )

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

bootstrap()
