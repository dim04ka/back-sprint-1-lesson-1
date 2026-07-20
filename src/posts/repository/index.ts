import {
    LikePost,
    LikePostModel,
    PostModel,
} from '../../db/mongo.db/schemes'
import { CreatePost, Post, PostViewModel } from '../dto'
import { ObjectId, WithId } from 'mongodb'
import type { PipelineStage } from 'mongoose'
import { PostQueryInput } from '../routes/input/post-query.input'
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error'

export class PostsRepository {
    async findManyWithBlogName(
        queryDto: PostQueryInput & {
            postId?: string
            blogId?: string
        }
    ): Promise<{
        items: WithId<PostViewModel>[]
        totalCount: number
    }> {
        const { pageNumber, pageSize, sortBy, sortDirection } =
            queryDto

        const normalizedPageNumber = Number(pageNumber) || 1
        const normalizedPageSize = Number(pageSize) || 10

        const skip = (normalizedPageNumber - 1) * normalizedPageSize
        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1

        const filter: any = {}
        if (queryDto.postId) {
            filter._id = new ObjectId(queryDto.postId)
        }
        if (queryDto.blogId) {
            filter.blogId = queryDto.blogId
        }

        const pipeline: PipelineStage[] = [
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
                        { $limit: normalizedPageSize },
                    ],
                    totalCount: [{ $count: 'count' }],
                },
            },
        ]

        const result = await PostModel.aggregate(pipeline).exec()

        const items = result[0]?.items || []
        const totalCount = result[0]?.totalCount[0]?.count || 0

        return {
            items: items.map((item: any) => ({
                ...item,
                id: item._id.toString(),
            })),
            totalCount,
        }
    }
    async findById(id: string): Promise<WithId<Post>> {
        const res = await PostModel.findOne({
            _id: new ObjectId(id),
        })
        if (!res) {
            throw new RepositoryNotFoundError('Post not exist')
        }
        return res
    }
    async create(
        post: CreatePost & { createdAt: string }
    ): Promise<{ id: string }> {
        const result = await PostModel.create(post as PostViewModel)

        return { id: result._id.toString() }
    }
    async delete(id: string): Promise<void> {
        const result = await PostModel.deleteOne({
            _id: new ObjectId(id),
        })
        if (result.deletedCount === 0) {
            throw new RepositoryNotFoundError('Post not found')
        }
        return
    }
    async update({
        id,
        post,
    }: {
        id: string
        post: CreatePost
    }): Promise<void> {
        const result = await PostModel.updateOne(
            { _id: new ObjectId(id) },
            { $set: post }
        )
        if (result.matchedCount === 0) {
            throw new RepositoryNotFoundError('Post not found')
        }
    }
    async removeLikeStatus(
        postId: string,
        userId: string
    ): Promise<void> {
        await LikePostModel.deleteOne({ postId, userId })
    }
    async findLikesByPostId(postId: string): Promise<LikePost[]> {
        return await LikePostModel.find({ postId }).lean()
    }
    async findLikeStatusByPostIdAndUserId(
        postId: string,
        userId: string
    ): Promise<LikePost | null> {
        return await LikePostModel.findOne({ postId, userId }).lean()
    }

    async createLikeStatus(
        postId: string,
        userId: string,
        likeStatus: 'Like' | 'Dislike' | 'None'
    ): Promise<void> {
        await LikePostModel.create({
            postId,
            userId,
            status: likeStatus,
            addedAt: new Date().toISOString(),
        })
    }
    async updateLikeStatus(
        postId: string,
        userId: string,
        likeStatus: 'Like' | 'Dislike' | 'None'
    ): Promise<void> {
        await LikePostModel.findOneAndUpdate(
            { postId, userId },
            {
                $set: {
                    status: likeStatus,
                    addedAt: new Date().toISOString(),
                },
            },
            { upsert: true }
        )
    }
}
