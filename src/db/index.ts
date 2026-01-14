import { Video, Resolution } from '../videos/dto'
import { Blog } from '../blogs/dto'
import { Post } from '../posts/dto'

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
    blogs: <Blog[]>[
        {
            id: '1',
            name: 'Blog 1',
            description: 'Description 1',
            websiteUrl: 'https://blog1.com',
        },
    ],
    posts: <Post[]>[
        {
            id: '1',
            title: 'Post 1',
            shortDescription: 'Short Description 1',
            content: 'Content 1',
            blogId: 1,
            blogName: 'Blog 1',
        },
    ],
}
