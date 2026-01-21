import { PaginationAndSorting } from '../../../core/types/pagination-and-sorting'
import { BlogSortFields } from './blog-sort.input'

export type BlogQueryInput = PaginationAndSorting<BlogSortFields> & {
    searchNameTerm?: string
}
