import { model, Schema } from 'mongoose'
import { LIKES_POST_COLLECTION_NAME } from '../constants'

export type LikePost = {
    postId: string
    userId: string
    status: string
    addedAt: string
}
export const LikePostSchema = new Schema({
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, required: true },
    addedAt: { type: String, required: true },
})

export const LikePostModel = model<LikePost>(
    LIKES_POST_COLLECTION_NAME,
    LikePostSchema
)
