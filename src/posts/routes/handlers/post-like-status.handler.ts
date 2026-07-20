import { postsService } from '../../../composition-root'
import { errorsHandler } from '../../../core/errors/errors.handler'
import { HttpStatus } from '../../../core/types/http-statuses'
import { Request, Response } from 'express'

export const postLikeStatusHandler = async (
    req: Request<{ postId: string }>,
    res: Response
) => {
    const { postId } = req.params
    const { likeStatus } = req.body

    try {
        const userId = req.user!.id

        const currentLikeStatus =
            await postsService.findLikeStatusByPostIdAndUserId(
                postId,
                userId
            )
        if (currentLikeStatus) {
            if (likeStatus === 'None') {
                await postsService.removeLikeStatus(postId, userId)
                return res.sendStatus(HttpStatus.NoContent)
            }

            if (currentLikeStatus.status === likeStatus) {
                return res.sendStatus(HttpStatus.NoContent)
            }
            await postsService.updateLikeStatus(
                postId,
                userId,
                likeStatus
            )
        } else {
            if (likeStatus === 'None') {
                return res.sendStatus(HttpStatus.NoContent)
            }

            await postsService.createLikeStatus(
                postId,
                userId,
                likeStatus
            )
        }
        return res.sendStatus(HttpStatus.NoContent)
    } catch (error) {
        errorsHandler(error, res)
    }
}
