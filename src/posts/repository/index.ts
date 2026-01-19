import { postsCollection } from '../../db/mongo.db'
import { CreatePost, PostViewModel } from '../dto'
import { ObjectId, WithId } from 'mongodb'

export const postsRepository = {
    async findAll(): Promise<WithId<PostViewModel>[] | undefined> {
        return postsCollection.find().toArray()
    },
    async findById(id: string): Promise<WithId<PostViewModel> | null> {
        return postsCollection.findOne({ _id: new ObjectId(id) })

    },
    async create(post: CreatePost & { createdAt: string }): Promise<string> {
        
        const result = await postsCollection.insertOne(post as PostViewModel);

        return result.insertedId.toString();
    },
    async delete(id: string): Promise<void> {
        const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            throw new Error('Post not found');
        }
    },
    async update({id, post}: {id: string, post: CreatePost}): Promise<void> {
        const result = await postsCollection.updateOne({ _id: new ObjectId(id) }, { $set: post });
        if (result.matchedCount === 0) {
            throw new Error('Post not found');
        }
    },
}
