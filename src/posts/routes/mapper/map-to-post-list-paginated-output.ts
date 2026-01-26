import { WithId } from 'mongodb'
import { PostViewModel } from '../../dto'
import { PostViewModelListPaginatedOutput } from '../output/post-list-paginated-output'

export const mapToPostListPaginatedOutput = (
    items: WithId<PostViewModel>[],
    meta: {
        pageNumber: number
        pageSize: number
        totalCount: number
    }
): PostViewModelListPaginatedOutput => {
    return {
        items,
        meta: {
            page: meta.pageNumber,
            pageSize: meta.pageSize,
            totalCount: meta.totalCount,
            pageCount: Math.ceil(meta.totalCount / meta.pageSize),
        },
    }
}
