import { model, Schema } from 'mongoose'
import { SESSIONS_COLLECTION_NAME } from '../constants'

export type SessionsType = {
    user_id: string
    device_id: string
    iat: Date
    device_name: string
    ip: string
    exp: Date
}

export const SessionSchema = new Schema({
    userId: String,
    deviceId: String,
    iat: Date,
    deviceName: String,
    ip: String,
    createdAt: { type: Date, default: Date.now },
})

export const SessionModel = model<SessionsType>(
    SESSIONS_COLLECTION_NAME,
    SessionSchema
)
