import { model, Schema } from 'mongoose'
import { LIKES_COMMENT_COLLECTION_NAME } from '../constants'

export type LikeComment = {
    commentId: string
    userId: string
    status: string
}
export const LikeCommentSchema = new Schema({
    commentId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, required: true },
})

export const LikeCommentModel = model<LikeComment>(
    LIKES_COMMENT_COLLECTION_NAME,
    LikeCommentSchema
)
