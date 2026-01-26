import { PaginationAndSorting } from '../../../core/types/pagination-and-sorting'
import { PostSortFields } from '../../../posts/routes/input/post-sort.input'
import { BlogSortFields } from './blog-sort.input'

export type BlogQueryInput = PaginationAndSorting<BlogSortFields> & {
    searchNameTerm?: string
}

export type BlogPostQueryInput =
    PaginationAndSorting<PostSortFields> & {
        blogId: string
    }
