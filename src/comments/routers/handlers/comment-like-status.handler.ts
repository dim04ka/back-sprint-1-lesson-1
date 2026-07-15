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
        await commentsService.createLikeStatus(id, userId, likeStatus)
        res.sendStatus(204)
    } catch (error) {
        return res.status(400).send({ message: 'Bad Request' })
    }

    res.sendStatus(204)
}
