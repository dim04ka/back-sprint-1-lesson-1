import { ObjectId, WithId } from 'mongodb'
import { blogsCollection } from '../../db/mongo.db'
import { Blog, BlogViewModel } from '../dto'

export const blogsRepository = {
    async findAll(): Promise<WithId<Blog>[] | undefined> {
        return blogsCollection.find().toArray()
    },
    async findById(id: string): Promise<WithId<Blog> | null> {
        return blogsCollection.findOne({ _id: new ObjectId(id) })
    },
    async create(blog: Blog): Promise<{ id: string }> {
   
        const result = await blogsCollection.insertOne(blog)
        return { id: result.insertedId.toString() }
    },
    async update({id, blog}: {id: string, blog: Blog}): Promise<void> {
        const result = await blogsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: blog }
        )
        if (result.matchedCount === 0) {
            throw new Error('Blog not found')
        }
    },
    async delete(id: string): Promise<void> {
        const deletedResult = await blogsCollection.deleteOne({ _id: new ObjectId(id) })
        if (deletedResult.deletedCount === 0) {
            throw new Error('Blog not found')
        }
    },
}
