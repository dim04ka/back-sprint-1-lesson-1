import { model, Schema } from 'mongoose'
import { RACE_LIMITED_REQUESTS_COLLECTION_NAME } from '../constants'

export type RaceLimitedRequestsType = {
    IP: string
    URL: string
    date: Date
}

export const RaceLimitedRequestsSchema = new Schema({
    IP: String,
    URL: String,
    date: Date,
})

export const RaceLimitedRequestsModel =
    model<RaceLimitedRequestsType>(
        RACE_LIMITED_REQUESTS_COLLECTION_NAME,
        RaceLimitedRequestsSchema
    )
