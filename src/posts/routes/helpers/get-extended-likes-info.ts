import { postsService, usersQueryService } from '../../../composition-root'
import { ExtendedLikesInfo } from '../../dto'

export const getExtendedLikesInfo = async (
    postId: string,
    requestedUserId: string | null
): Promise<ExtendedLikesInfo> => {
    const likes = await postsService.findLikesByPostId(postId)
    const onlyLikes = likes.filter((like) => like.status === 'Like')

    const newestLikes = await Promise.all(
        onlyLikes
            .sort(
                (a, b) =>
                    new Date(b.addedAt).getTime() -
                    new Date(a.addedAt).getTime()
            )
            .slice(0, 3)
            .map(async (like) => {
                const user = await usersQueryService.findById(like.userId)

                return {
                    addedAt: like.addedAt,
                    userId: like.userId,
                    login: user?.login || '',
                }
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
