import { Router, Request, Response } from 'express'
import { db } from '../db'
import { Video } from '../types'

export const videosRouter = Router({})

videosRouter.get('', (_: Request, res: Response) => {
    return res.status(200).send(db.videos)
})

videosRouter.get('/:id', (req: Request, res: Response) => {
    const video = db.videos.find((v) => v.id === +req.params.id)
    if (!video) {
        return res.status(404).send({ message: 'Video not found' })
    }

    res.status(200).send(video)
})

videosRouter.post('', (req: Request, res: Response) => {
    const date = new Date()

    const createdAt = date.toISOString()
    const publicationDate = new Date(
        date.setHours(date.getHours() + 1)
    ).toISOString()
    const newVideo: Video = {
        id: db.videos.length
            ? db.videos[db.videos.length - 1].id + 1
            : 1,
        title: req.body.title,
        author: req.body.author,
        availableResolutions: req.body.availableResolutions,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt,
        publicationDate,
    }

    db.videos.push(newVideo)

    res.status(201).send(newVideo)
})

videosRouter.put('/:id', (req: Request, res: Response) => {
    const video = db.videos.find((v) => v.id === +req.params.id)
    if (!video) {
        return res.status(404).send({ message: 'Video not found' })
    }

    const date = new Date()

    const publicationDate = new Date(
        date.setHours(date.getHours() + 1)
    ).toISOString()

    video.title = req.body.title
    video.author = req.body.author
    video.availableResolutions = req.body.availableResolutions
    video.canBeDownloaded = req.body.canBeDownloaded ?? false
    video.minAgeRestriction = req.body.minAgeRestriction ?? null
    video.publicationDate =
        req.body.publicationDate ?? publicationDate

    res.status(204).send()
})

videosRouter.delete('/:id', (req: Request, res: Response) => {
    const video = db.videos.find((v) => v.id === +req.params.id)
    if (!video) {
        return res.status(404).send({ message: 'Video not found' })
    }

    db.videos = db.videos.filter((v) => v.id !== +req.params.id)
    res.status(204).send()
})
