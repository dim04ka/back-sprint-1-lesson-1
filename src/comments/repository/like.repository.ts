import { LikeModel } from '../../db/mongo.db/schemes'

export class LikeRepository {
    async deleteLikeStatus(commentId: string, userId: string) {
        return await LikeModel.deleteOne({ commentId, userId })
    }
    async findLikeByCommentIdAndUserId(
        commentId: string,
        userId: string
    ) {
        return await LikeModel.findOne({ commentId, userId }).lean()
    }

    async findLikesByCommentId(commentId: string) {
        return await LikeModel.find({ id: commentId }).lean()
    }

    async createLikeStatus(
        commentId: string,
        userId: string,
        likeStatus: 'Like' | 'Dislike' | 'None'
    ) {
        return await LikeModel.create({
            commentId,
            userId,
            status: likeStatus,
        })
    }
    async updateLikeStatus(
        commentId: string,
        userId: string,
        likeStatus: 'Like' | 'Dislike' | 'None'
    ) {
        return await LikeModel.updateOne(
            { commentId, userId },
            { $set: { status: likeStatus } }
        )
    }
}
