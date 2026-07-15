import { commentsService } from '../../../composition-root'
import { Request, Response } from 'express'

export const commentLikeStatusHandler = async (
    req: Request<
        { id: string },
        {},
        { likeStatus: 'Like' | 'Dislike' | 'None' }
    >,
    res: Response
) => {
    const { id } = req.params
    const { likeStatus } = req.body
    const userId = req.user!.id

    try {
        const like = await commentsService.findLikeByCommentIdAndUserId(
            id,
            userId
        )

        if (likeStatus === 'None') {
            await commentsService.deleteCommentLikeStatus(id, userId)

            return res.sendStatus(204)
        }

        if (!like) {
            await commentsService.createLikeStatus(
                id,
                userId,
                likeStatus
            )

            return res.sendStatus(204)
        }

        if (like.status === likeStatus) {
            return res.sendStatus(204)
        }

        await commentsService.updateCommentLikeStatus(
            id,
            userId,
            likeStatus
        )

        return res.sendStatus(204)
    } catch (error) {
        return res.status(400).send({ message: 'Bad Request' })
    }
}
