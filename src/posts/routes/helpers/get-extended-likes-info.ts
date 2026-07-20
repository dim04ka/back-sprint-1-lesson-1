import { ObjectId } from 'mongodb'
import { postsService } from '../../../composition-root'
import { UserModel } from '../../../db/mongo.db/schemes'
import { ExtendedLikesInfo } from '../../dto'

export const getExtendedLikesInfo = async (
    postId: string,
    requestedUserId: string | null
): Promise<ExtendedLikesInfo> => {
    const likes = await postsService.findLikesByPostId(postId)
    const onlyLikes = likes.filter((like) => like.status === 'Like')

    const newestLikeStatuses = onlyLikes
        .sort(
            (a, b) =>
                new Date(b.addedAt).getTime() -
                new Date(a.addedAt).getTime()
        )
        .slice(0, 3)

    const users = await UserModel.find({
        _id: {
            $in: newestLikeStatuses.map(
                (like) => new ObjectId(like.userId)
            ),
        },
    }).lean()

    const loginsByUserId = new Map(
        users.map((user) => [user._id.toString(), user.login])
    )

    const newestLikes = newestLikeStatuses.map((like) => ({
        addedAt: like.addedAt,
        userId: like.userId,
        login: loginsByUserId.get(like.userId) || '',
    })
    )

    return {
        likesCount: onlyLikes.length,
        dislikesCount: likes.filter(
            (like) => like.status === 'Dislike'
        ).length,
        myStatus: requestedUserId
            ? likes.find((like) => like.userId === requestedUserId)
                  ?.status || 'None'
            : 'None',
        newestLikes,
    }
}
