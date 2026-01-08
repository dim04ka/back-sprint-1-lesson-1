import { db } from '../../db'
import { Video } from '../dto'

export const videosRepository = {
    findAll(): Video[] {
        return db.videos
    },
    findById(id: number): Video | undefined {
        return db.videos.find((v) => v.id === id)
    },
    create(video: Video) {
        db.videos.push(video)
        return video
    },
    update(video: Video) {
        const foundIndex = db.videos.findIndex(
            (v) => v.id === video.id
        )
        if (foundIndex === -1) {
            throw new Error('Video not found')
        }
        db.videos[foundIndex] = video
        return video
    },
    delete(id: number) {
        const foundVideo = db.videos.find((v) => v.id === id)
        if (!foundVideo) {
            throw new Error('Video not found')
        }
        db.videos = db.videos.filter((v) => v.id !== id)
        return
    },
}
