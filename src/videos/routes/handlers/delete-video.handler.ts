import { Request, Response } from 'express'
import { videosRepository } from '../../repositories/videos.repository'
import { HttpStatus } from '../../../core/types/http-statuses'

export const deleteVideoHandler = (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const video = videosRepository.findById(id)
    if (!video) {
        return res
            .status(HttpStatus.NotFound)
            .send({ message: 'Video not found' })
    }

    videosRepository.delete(id)
    res.sendStatus(HttpStatus.NoContent)
}
