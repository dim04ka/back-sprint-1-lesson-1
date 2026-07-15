import mongoose, { Model, HydratedDocument, model } from 'mongoose'
import { Comment } from '../../../comments/types/comment'
import { COMMENTS_COLLECTION_NAME } from '../constants'

export type CommentModel = Model<Comment>

export type CommentDocument = HydratedDocument<Comment>

const commentSchema = new mongoose.Schema<Comment>({
    content: { type: String, required: true },
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    createdAt: { type: String, required: true },
})

export const CommentModel = model<Comment>(
    COMMENTS_COLLECTION_NAME,
    commentSchema
)
