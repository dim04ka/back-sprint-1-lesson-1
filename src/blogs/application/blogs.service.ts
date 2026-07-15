import { BlogsRepository } from '../repository/blogs.repository'
import { Blog, BlogUpdateInputDto } from '../domain'
import { WithId } from 'mongodb'
import { BlogQueryInput } from '../routes/input/blog-query.input'

export class BlogsService {
    constructor(private readonly blogsRepository: BlogsRepository) {}
    async findMany(
        queryDto: BlogQueryInput
    ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        return this.blogsRepository.findMany(queryDto)
    }
    async findById(id: string): Promise<WithId<Blog>> {
        return this.blogsRepository.findById(id)
    }
    async delete(id: string): Promise<void> {
        await this.blogsRepository.delete(id)
        return
    }

    async create(blog: Blog): Promise<{ id: string }> {
        return await this.blogsRepository.create(blog)
    }
    async update({
        id,
        blog,
    }: {
        id: string
        blog: BlogUpdateInputDto
    }): Promise<void> {
        await this.blogsRepository.update({ id, blog })
        return
    }
}
