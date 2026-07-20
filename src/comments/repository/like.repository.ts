import { LikeCommentModel } from '../../db/mongo.db/schemes'

export class LikeRepository {
    async deleteLikeStatus(commentId: string, userId: string) {
        return await LikeCommentModel.deleteOne({ commentId, userId })
    }
    async findLikeByCommentIdAndUserId(
        commentId: string,
        userId: string
    ) {
        return await LikeCommentModel.findOne({
            commentId,
            userId,
        }).lean()
    }

    async findLikesByCommentId(commentId: string) {
        return await LikeCommentModel.find({ commentId }).lean()
    }

    async createLikeStatus(
        commentId: string,
        userId: string,
        likeStatus: 'Like' | 'Dislike' | 'None'
    ) {
        return await LikeCommentModel.create({
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
        return await LikeCommentModel.updateOne(
            { commentId, userId },
            { $set: { status: likeStatus } }
        )
    }
}
