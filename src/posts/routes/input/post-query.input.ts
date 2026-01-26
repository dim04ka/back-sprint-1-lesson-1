import { PaginationAndSorting } from '../../../core/types/pagination-and-sorting'
import { PostSortFields } from './post-sort.input'

export type PostQueryInput = PaginationAndSorting<PostSortFields>
