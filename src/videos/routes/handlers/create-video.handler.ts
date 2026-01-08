import { Request, Response } from 'express'
import { videosRepository } from '../../repositories/videos.repository'
import { HttpStatus } from '../../../core/types/http-statuses'
import {
    getCreatedAndPublicationDates,
    validateCreateVideoDto,
} from '../../utils'
import { db } from '../../../db'
import { Video } from '../../dto'

export const createVideoHandler = (req: Request, res: Response) => {
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

    videosRepository.create(newVideo)

    res.status(HttpStatus.Created).send(newVideo)
}
