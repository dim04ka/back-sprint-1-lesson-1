import { Video, Resolution } from '../types'

export const db = {
    videos: <Video[]>[
        {
            id: 1,
            title: 'Title',
            author: 'Author',
            canBeDownloaded: true,
            minAgeRestriction: 18,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: [
                Resolution.x144,
                Resolution.x240,
                Resolution.x360,
                Resolution.x480,
                Resolution.x720,
                Resolution.x1080,
                Resolution.x1440,
                Resolution.x2160,
            ],
        },
        {
            id: 2,
            title: 'Title 2',
            author: 'Author 2',
            canBeDownloaded: false,
            minAgeRestriction: 18,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: [Resolution.x144],
        },
        {
            id: 3,
            title: 'Title 3',
            author: 'Author 3',
            canBeDownloaded: true,
            minAgeRestriction: 18,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: [],
        },
    ],
}
