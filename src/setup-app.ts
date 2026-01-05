import express, { Express } from 'express'
import { db } from './db'
import { Video, HttpStatus } from './types'

export const setupApp = (app: Express) => {
    app.use(express.json()) // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get('/', (req, res) => {
        res.status(200).send('Hello world!')
    })

    app.get('/videos', (req, res) => {
        res.status(200).send(db.videos)
    })

    app.get('/videos/:id', (req, res) => {
        const video = db.videos.find((v) => v.id === +req.params.id)
        if (!video) {
            return res
                .status(404)
                .send({ message: 'Video not found' })
        }
        // возвращаем ответ
        res.status(200).send(video)
    })

    app.post('/videos', (req, res) => {
        console.log('req.body:', req.body)
        //1) проверяем приходящие данные на валидность
        const newVideo: Video = {
            id: db.videos.length
                ? db.videos[db.videos.length - 1].id + 1
                : 1,
            title: req.body.title,
            author: req.body.author,
            availableResolutions: req.body.availableResolutions,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
        }

        db.videos.push(newVideo)

        res.status(201).send(newVideo)
    })

    app.delete('/testing/all-data', (req, res) => {
        db.videos = []
        res.sendStatus(HttpStatus.NoContent)
    })
}
