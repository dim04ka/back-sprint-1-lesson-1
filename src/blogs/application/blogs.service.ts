import { blogsRepository } from '../repository/blogs.repository'
import { Blog, BlogUpdateInputDto } from '../domain'
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
    async delete(id: string): Promise<void> {
        await blogsRepository.delete(id)
        return
    },

    async create(blog: Blog): Promise<{ id: string }> {
        return await blogsRepository.create(blog)
    },
    async update({
        id,
        blog,
    }: {
        id: string
        blog: BlogUpdateInputDto
    }): Promise<void> {
        await blogsRepository.update({ id, blog })
        return
    },
}
