import { postsCollection } from '../../db/mongo.db'
import { CreatePost, Post, PostViewModel } from '../dto'
import { ObjectId, WithId } from 'mongodb'
import { PostQueryInput } from '../routes/input/post-query.input'
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error'

export const postsRepository = {
    async findManyWithBlogName(
        queryDto: PostQueryInput & { postId?: string }
    ): Promise<{
        items: WithId<PostViewModel>[]
        totalCount: number
    }> {
        const { pageNumber, pageSize, sortBy, sortDirection } =
            queryDto

        const skip = (pageNumber - 1) * pageSize
        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1

        const filter: any = {}
        if (queryDto.postId) {
            filter._id = new ObjectId(queryDto.postId)
        }

        const pipeline = [
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'blogs',
                    let: { blogId: { $toObjectId: '$blogId' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$blogId'] },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                    as: 'blog',
                },
            },
            {
                $unwind: {
                    path: '$blog',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    shortDescription: 1,
                    content: 1,
                    blogId: 1,
                    blogName: { $ifNull: ['$blog.name', ''] },
                    createdAt: 1,
                },
            },
            {
                $facet: {
                    items: [
                        { $sort: { [sortBy]: sortDirectionNumber } },
                        { $skip: skip },
                        { $limit: pageSize },
                    ],
                    totalCount: [{ $count: 'count' }],
                },
            },
        ]

        const result = await postsCollection
            .aggregate(pipeline)
            .toArray()

        const items = result[0]?.items || []
        const totalCount = result[0]?.totalCount[0]?.count || 0

        return {
            items: items.map((item: any) => ({
                ...item,
                id: item._id.toString(),
            })) as WithId<PostViewModel>[],
            totalCount,
        }
    },
    async findById(id: string): Promise<WithId<Post>> {
        const res = await postsCollection.findOne({
            _id: new ObjectId(id),
        })
        if (!res) {
            throw new RepositoryNotFoundError('Post not exist')
        }
        return res
    },
    async create(
        post: CreatePost & { createdAt: string }
    ): Promise<{ id: string }> {
        const result = await postsCollection.insertOne(
            post as PostViewModel
        )

        return { id: result.insertedId.toString() }
    },
    async delete(id: string): Promise<void> {
        const result = await postsCollection.deleteOne({
            _id: new ObjectId(id),
        })
        if (result.deletedCount === 0) {
            throw new Error('Post not found')
        }
    },
    async update({
        id,
        post,
    }: {
        id: string
        post: CreatePost
    }): Promise<void> {
        const result = await postsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: post }
        )
        if (result.matchedCount === 0) {
            throw new Error('Post not found')
        }
    },
}
