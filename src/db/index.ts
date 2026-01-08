import { Video, Resolution } from '../videos/dto'

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
                Resolution.P144,
                Resolution.P240,
                Resolution.P360,
                Resolution.P480,
                Resolution.P720,
                Resolution.P1080,
                Resolution.P1440,
                Resolution.P2160,
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
            availableResolutions: [Resolution.P144],
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
