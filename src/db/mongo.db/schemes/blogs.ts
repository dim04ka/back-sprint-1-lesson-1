import { model, Schema } from 'mongoose'
import { BLOGS_COLLECTION_NAME } from '../constants'
import { Blog } from '../../../blogs/domain'

export const BlogSchema = new Schema({
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: { type: Date, default: Date.now },
    isMembership: { type: Boolean, default: false },
})

export const BlogModel = model<Blog>(
    BLOGS_COLLECTION_NAME,
    BlogSchema
)
