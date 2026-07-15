import { LikeModel } from '../../db/mongo.db/schemes'

export class LikeRepository {
    async findLikesByCommentId(commentId: string) {
        return await LikeModel.find({ commentId }).lean()
    }

    async createLikeStatus(
        commentId: string,
        userId: string,
        likeStatus: 'Like' | 'Dislike' | 'None'
    ) {
        debugger
        return await LikeModel.create({
            commentId,
            userId,
            status: likeStatus,
        })
    }
    async updateLikeStatus(
        commentId: string,
        likeStatus: 'Like' | 'Dislike' | 'None'
    ) {
        return await LikeModel.updateOne(
            { commentId },
            { $set: { status: likeStatus } }
        )
    }
}
