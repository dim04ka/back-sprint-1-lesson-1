import { ObjectId, WithId } from 'mongodb'
import { blogsCollection } from '../../db/mongo.db'
import { Blog } from '../domain'
import { BlogQueryInput } from '../routes/input/blog-query.input'
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error'

export const blogsRepository = {
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

        const items = await blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray()

        const totalCount =
            await blogsCollection.countDocuments(filter)

        return { items, totalCount }
    },

    async findById(id: string): Promise<WithId<Blog>> {
        const res = await blogsCollection.findOne({
            _id: new ObjectId(id),
        })

        if (!res) {
            throw new RepositoryNotFoundError('Blog not exist')
        }
        return res
    },
    async create(blog: Blog): Promise<{ id: string }> {
        const result = await blogsCollection.insertOne(blog)
        return { id: result.insertedId.toString() }
    },
    async update({
        id,
        blog,
    }: {
        id: string
        blog: Blog
    }): Promise<void> {
        const result = await blogsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: blog }
        )
        if (result.matchedCount === 0) {
            throw new Error('Blog not found')
        }
    },
    async delete(id: string): Promise<void> {
        const deletedResult = await blogsCollection.deleteOne({
            _id: new ObjectId(id),
        })
        if (deletedResult.deletedCount === 0) {
            throw new Error('Blog not found')
        }
    },
}
