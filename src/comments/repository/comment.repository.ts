import { CommentModel } from '../../db/mongo.db/schemes/comment'
import { Comment } from '../types/comment'
import { PostQueryInput } from '../../posts/routes/input/post-query.input'
import { ObjectId } from 'mongodb'
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error'
import { UserModel } from '../../db/mongo.db/schemes/users'
import { LikeCommentModel } from '../../db/mongo.db/schemes'

export class CommentsRepository {
    constructor() {}
    async update(id: string, content: string): Promise<void> {
        const result = await CommentModel.updateOne(
            { _id: new ObjectId(id) },
            { $set: { content } }
        )
        if (result.matchedCount === 0) {
            throw new RepositoryNotFoundError('Comment not found')
        }
    }
    async delete(id: string): Promise<void> {
        const result = await CommentModel.deleteOne({
            _id: new ObjectId(id),
        })
        if (result.deletedCount === 0) {
            throw new RepositoryNotFoundError('Comment not found')
        }
        return
    }
    async findById(id: string) {
        const comment = await CommentModel.findOne({
            _id: new ObjectId(id),
        })
        return comment
    }
    async create(comment: Comment) {
        const newComment = await CommentModel.insertOne(comment)
        return newComment._id.toString()
    }

    async findMany({
        postId,
        queryDto,
        requestedUserId,
    }: {
        postId: string
        queryDto: PostQueryInput
        requestedUserId?: string | null
    }) {
        const { pageNumber, pageSize, sortBy, sortDirection } =
            queryDto

        const skip = (pageNumber - 1) * pageSize
        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1

        const comments = await CommentModel.find({ postId })
            .sort({ [sortBy]: sortDirectionNumber })
            .skip(skip)
            .limit(pageSize)
            .lean()

        const totalCount = await CommentModel.countDocuments({
            postId,
        })

        const commentsWithUser = await Promise.all(
            comments.map(async (comment) => {
                const user = await UserModel.findById(comment.userId)

                const likesInfo = {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                }

                const likes = await LikeCommentModel.find({
                    commentId: comment._id.toString(),
                })
                likesInfo.likesCount = likes.filter(
                    (like) => like.status === 'Like'
                ).length
                likesInfo.dislikesCount = likes.filter(
                    (like) => like.status === 'Dislike'
                ).length
                likesInfo.myStatus = requestedUserId
                    ? (likes.find(
                          (like) => like.userId === requestedUserId
                      )?.status ?? 'None')
                    : 'None'

                return {
                    id: comment._id.toString(),
                    content: comment.content,
                    commentatorInfo: {
                        userId: comment.userId,
                        userLogin: user?.login ?? '',
                    },
                    createdAt: comment.createdAt,
                    likesInfo,
                }
            })
        )
        return {
            items: commentsWithUser,
            totalCount,
        }
    }
}
