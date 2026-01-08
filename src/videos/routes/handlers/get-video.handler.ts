import { HttpStatus } from '../../../core/types/http-statuses'
import { videosRepository } from '../../repositories/videos.repository'
import { Request, Response } from 'express'

export const getVideoHandler = (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const video = videosRepository.findById(id)

    if (!video) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Video not found' })
    }

    res.send(video)
}
