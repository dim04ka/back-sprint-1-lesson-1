import { blogsRepository } from '../repository/blogs.repository'
import { Blog } from '../domain'
import { WithId } from 'mongodb'
import { BlogQueryInput } from '../routes/input/blog-query.input'

export const blogsService = {
    async findMany(
        queryDto: BlogQueryInput
    ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        return blogsRepository.findMany(queryDto)
    },
    async findById(id: string): Promise<WithId<Blog>> {
        return blogsRepository.findById(id)
    },
}
