import { model, Schema } from 'mongoose'
import { LIKES_COLLECTION_NAME } from '../constants'

export type Like = {
    commentId: string
    userId: string
    status: string
}
export const LikeSchema = new Schema({
    commentId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, required: true },
})

export const LikeModel = model<Like>(
    LIKES_COLLECTION_NAME,
    LikeSchema
)
