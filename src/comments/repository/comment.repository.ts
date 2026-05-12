import { commentsCollection } from '../../db/mongo.db'
import { Comment } from '../types/comment'
import { usersRepository } from '../../users/repository/users.repository'
import { PostQueryInput } from '../../posts/routes/input/post-query.input'
import { ObjectId } from 'mongodb'
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error'

export const commentsRepository = {
    async update(id: string, content: string): Promise<void> {
        const result = await commentsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { content } }
        )
        if (result.matchedCount === 0) {
            throw new RepositoryNotFoundError('Comment not found')
        }
    },
    async delete(id: string): Promise<void> {
        const result = await commentsCollection.deleteOne({
            _id: new ObjectId(id),
        })
        if (result.deletedCount === 0) {
            throw new RepositoryNotFoundError('Comment not found')
        }
        return
    },
    async findById(id: string) {
        const comment = await commentsCollection.findOne({
            _id: new ObjectId(id),
        })
        return comment
    },
    async create(comment: Comment) {
        const newComment = await commentsCollection.insertOne(comment)
        return newComment.insertedId.toString()
    },

    async findMany({
        postId,
        queryDto,
    }: {
        postId: string
        queryDto: PostQueryInput
    }) {
        const { pageNumber, pageSize, sortBy, sortDirection } =
            queryDto

        const skip = (pageNumber - 1) * pageSize
        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1

        const comments = await commentsCollection
            .find({ postId })
            .sort({ [sortBy]: sortDirectionNumber })
            .skip(skip)
            .limit(pageSize)
            .toArray()

        const totalCount = await commentsCollection.countDocuments({
            postId,
        })

        const commentsWithUser = await Promise.all(
            comments.map(async (comment) => {
                const user = await usersRepository.findById(
                    comment.userId
                )

                return {
                    id: comment._id.toString(),
                    content: comment.content,
                    commentatorInfo: {
                        userId: comment.userId,
                        userLogin: user?.login ?? '',
                    },
                    createdAt: comment.createdAt,
                }
            })
        )
        return {
            items: commentsWithUser,
            totalCount,
        }
    },
}
