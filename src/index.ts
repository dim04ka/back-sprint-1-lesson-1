import express from 'express'
import { setupApp } from './setup-app'

export const app = express()
setupApp(app)

export default app

// запуск сервера для локальной разработки (не на Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const PORT = process.env.PORT || 5001
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`)
    })
}
