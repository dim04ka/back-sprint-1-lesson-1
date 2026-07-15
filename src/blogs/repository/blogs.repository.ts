import { ObjectId, WithId } from 'mongodb'
import { BlogModel } from '../../db/mongo.db/schemes'
import { Blog, BlogUpdateInputDto } from '../domain'
import { BlogQueryInput } from '../routes/input/blog-query.input'
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error'

export class BlogsRepository {
    async findMany(
        queryDto: BlogQueryInput
    ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
        } = queryDto

        const skip = (pageNumber - 1) * pageSize
        const filter: any = {}

        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' }
        }

        const items = await BlogModel.find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .lean()

        const totalCount = await BlogModel.countDocuments(filter)

        return { items, totalCount }
    }

    async findById(id: string): Promise<WithId<Blog>> {
        const res = await BlogModel.findOne({
            _id: new ObjectId(id),
        })

        if (!res) {
            throw new RepositoryNotFoundError('Blog not exist')
        }
        return res
    }
    async create(blog: Blog): Promise<{ id: string }> {
        const result = await BlogModel.create(blog)
        return { id: result._id.toString() }
    }
    async update({
        id,
        blog,
    }: {
        id: string
        blog: BlogUpdateInputDto
    }): Promise<void> {
        const result = await BlogModel.updateOne(
            { _id: new ObjectId(id) },
            { $set: blog }
        )
        if (result.matchedCount === 0) {
            throw new RepositoryNotFoundError('Blog not found')
        }
        return
    }
    async delete(id: string): Promise<void> {
        const deletedResult = await BlogModel.deleteOne({
            _id: new ObjectId(id),
        })
        if (deletedResult.deletedCount === 0) {
            throw new RepositoryNotFoundError('Blog not found')
        }
        return
    }
}
