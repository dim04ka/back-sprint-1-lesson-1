import { PostViewModel } from '../../dto'
import { PaginatedOutput } from '../../../core/types/paginated.output'

export type PostViewModelListPaginatedOutput = {
    items: PostViewModel[]
    meta: PaginatedOutput
}
