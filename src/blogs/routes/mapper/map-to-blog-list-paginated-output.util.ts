import { WithId } from 'mongodb'

import { Blog } from '../../domain'
import { BlogListPaginatedOutput } from '../output /blog-list-paginated.output'

export const mapToBlogListPaginatedOutput = (
    blogs: WithId<Blog>[],
    meta: {
        pageNumber: number
        pageSize: number
        totalCount: number
    }
): BlogListPaginatedOutput => {
    return {
        meta: {
            page: meta.pageNumber,
            pageSize: meta.pageSize,
            totalCount: meta.totalCount,
            pageCount: Math.ceil(meta.totalCount / meta.pageSize),
        },
        data: blogs.map((blog: WithId<Blog>) => {
            return {
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership,
            }
        }),
    }
}
