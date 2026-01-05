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
