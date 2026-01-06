import { Router, Request, Response } from 'express'
import { db } from '../db'
import { HttpStatus, Video } from '../types'
import {
    getCreatedAndPublicationDates,
    validateCreateVideoDto,
    validateUpdateVideoDto,
} from '../utils'

export const videosRouter = Router({})

videosRouter.get('', (_: Request, res: Response) => {
    return res.status(HttpStatus.Ok).send(db.videos)
})

videosRouter.get('/:id', (req: Request, res: Response) => {
    const video = db.videos.find((v) => v.id === +req.params.id)
    if (!video) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Video not found' })
    }

    res.status(HttpStatus.Ok).send(video)
})

videosRouter.post('', (req: Request, res: Response) => {
    const errorsMessages = validateCreateVideoDto(req.body)

    if (errorsMessages.length > 0) {
        return res
            .status(HttpStatus.BadRequest)
            .send({ errorsMessages })
    }

    const { createdAt, publicationDate } =
        getCreatedAndPublicationDates()
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

    res.status(HttpStatus.Created).send(newVideo)
})

videosRouter.put('/:id', (req: Request, res: Response) => {
    const video = db.videos.find((v) => v.id === +req.params.id)
    if (!video) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Video not found' })
    }
    const errorsMessages = validateUpdateVideoDto(req.body)
    if (errorsMessages.length > 0) {
        return res
            .status(HttpStatus.BadRequest)
            .send({ errorsMessages })
    }

    const { publicationDate } = getCreatedAndPublicationDates()

    video.title = req.body.title
    video.author = req.body.author
    video.availableResolutions = req.body.availableResolutions
    video.canBeDownloaded = req.body.canBeDownloaded ?? false
    video.minAgeRestriction = req.body.minAgeRestriction ?? null
    video.publicationDate =
        req.body.publicationDate ?? publicationDate

    res.status(HttpStatus.NoContent).send()
})

videosRouter.delete('/:id', (req: Request, res: Response) => {
    const video = db.videos.find((v) => v.id === +req.params.id)
    if (!video) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Video not found' })
    }

    db.videos = db.videos.filter((v) => v.id !== +req.params.id)
    res.status(HttpStatus.NoContent).send()
})
