import { model, Schema } from 'mongoose'
import { POSTS_COLLECTION_NAME } from '../constants'
import { Post } from '../../../posts/dto'

export const PostSchema = new Schema({
    title: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: { type: Date, default: Date.now },
})

export const PostModel = model<Post>(
    POSTS_COLLECTION_NAME,
    PostSchema
)
