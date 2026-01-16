import { Blog } from '../blogs/dto'
import { Post } from '../posts/dto'

export const db = {
    blogs: <Blog[]>[
        {
            id: '1',
            name: 'Blog 1',
            description: 'Description 1',
            websiteUrl: 'https://blog1.com',
        },
    ],
    posts: <Post[]>[],
}
