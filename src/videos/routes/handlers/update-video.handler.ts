import { Request, Response } from 'express'
import { videosRepository } from '../../repositories/videos.repository'
import { HttpStatus } from '../../../core/types/http-statuses'
import { validateUpdateVideoDto } from '../../utils'
import { getCreatedAndPublicationDates } from '../../utils'
import { Video } from '../../dto'

export const updateVideoHandler = (req: Request, res: Response) => {
    const errorsMessages = validateUpdateVideoDto(req.body)
    if (errorsMessages.length > 0) {
        return res
            .status(HttpStatus.BadRequest)
            .send({ errorsMessages })
    }

    const id = Number(req.params.id)
    const video = videosRepository.findById(id)
    if (!video) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Video not found' })
    }

    const { publicationDate } = getCreatedAndPublicationDates()

    const updatedVideo: Video = {
        ...video,
        title: req.body.title,
        author: req.body.author,
        availableResolutions: req.body.availableResolutions,
        canBeDownloaded: req.body.canBeDownloaded ?? false,
        minAgeRestriction: req.body.minAgeRestriction ?? null,
        publicationDate: req.body.publicationDate ?? publicationDate,
    }

    videosRepository.update(updatedVideo)

    res.sendStatus(HttpStatus.NoContent)
}
