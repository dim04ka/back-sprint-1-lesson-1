import { postsCollection } from '../../db/mongo.db'
import { Post } from '../dto'
import { ObjectId, WithId } from 'mongodb'

export const postsRepository = {
    async findAll(): Promise<WithId<Post>[] | undefined> {
        return postsCollection.find().toArray()
    },
    async findById(id: string): Promise<WithId<Post> | null> {
        return postsCollection.findOne({ _id: new ObjectId(id) })

    },
    async create(post: Post): Promise<WithId<{ createdAt: string }>> {
        const createdAt = new Date().toISOString();
        const postWithCreatedAt = { ...post, createdAt };
        const result = await postsCollection.insertOne(postWithCreatedAt);

        return { _id: result.insertedId, createdAt };
    },
    async delete(id: string): Promise<void> {
        const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            throw new Error('Post not found');
        }
    },
    async update({id, post}: {id: string, post: Post}): Promise<void> {
        const result = await postsCollection.updateOne({ _id: new ObjectId(id) }, { $set: post });
        if (result.matchedCount === 0) {
            throw new Error('Post not found');
        }
    },
}
