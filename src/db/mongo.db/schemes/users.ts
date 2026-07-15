import mongoose, { model } from 'mongoose'
import { USERS_COLLECTION_NAME } from '../constants'

export type User = {
    login: string
    email: string
    password: string
    createdAt: Date
}

const userSchema = new mongoose.Schema<User>({
    login: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true },
})
export const UserModel = model<User>(
    USERS_COLLECTION_NAME,
    userSchema
)
