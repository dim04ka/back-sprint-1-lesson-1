import { postsService } from '../../../composition-root'
import { errorsHandler } from '../../../core/errors/errors.handler'
import { getUserIdFromToken } from '../../../core/helpers/getUserIdFromToken'
import { HttpStatus } from '../../../core/types/http-statuses'
import e, { Request, Response } from 'express'

export const postLikeStatusHandler = async (
    req: Request<{ postId: string }>,
    res: Response
) => {
    const { postId } = req.params
    const { likeStatus } = req.body

    try {
        const token = req.headers.authorization?.split(' ')[1]

        const userId = await getUserIdFromToken(token as string)

        const currentLikeStatus =
            await postsService.findLikeStatusByPostIdAndUserId(
                postId,
                userId
            )
        if (currentLikeStatus) {
            if (likeStatus === 'None') {
                await postsService.removeLikeStatus(postId, userId)
                res.status(HttpStatus.Ok).send(likeStatus)
                return
            }

            if (currentLikeStatus.status === likeStatus) {
                res.status(HttpStatus.Ok).send(likeStatus)
                return
            }
            await postsService.updateLikeStatus(
                postId,
                userId,
                likeStatus
            )
        } else {
            await postsService.createLikeStatus(
                postId,
                userId,
                likeStatus
            )
        }
        res.status(HttpStatus.NoContent).send(likeStatus)
    } catch (error) {
        errorsHandler(e, res)
    }
}
