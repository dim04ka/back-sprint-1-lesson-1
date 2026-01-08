import { videosRepository } from '../../repositories/videos.repository'
import { Request, Response } from 'express'

export const getVideoListHandler = (_: Request, res: Response) => {
    const videos = videosRepository.findAll()

    res.send(videos)
}
