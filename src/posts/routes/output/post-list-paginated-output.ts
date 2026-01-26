import { PostViewModel } from '../../dto'
import { PaginatedOutput } from '../../../core/types/paginated.output'
import { WithId } from 'mongodb'

export type PostViewModelListPaginatedOutput = {
    items: WithId<PostViewModel>[]
    meta: PaginatedOutput
}
