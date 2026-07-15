import { commentsService } from '../../../composition-root'
import { Request, Response } from 'express'

export const commentLikeStatusHandler = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params
    const { likeStatus } = req.body
    const userId = req.user!.id
    const comment = res.locals.comment as Awaited<
        ReturnType<typeof commentsService.findById>
    >
    if (comment.userId !== userId) {
        return res.status(403).send({ message: 'Forbidden' })
    }
    // await commentsService.updateCommentLikeStatus(
    //     commentId,
    //     likeStatus
    // )
    res.sendStatus(204)
}
