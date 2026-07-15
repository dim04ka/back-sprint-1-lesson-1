import { commentsService } from '../../../composition-root'
import { Request, Response } from 'express'

export const commentUpdateHandler = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { content } = req.body
    const userId = req.user!.id
    const comment = res.locals.comment as Awaited<
        ReturnType<typeof commentsService.findById>
    >

    if (comment.userId !== userId) {
        return res.status(403).send({ message: 'Forbidden' })
    }
    try {
        await commentsService.updateComment(req.params.id, content)
        res.sendStatus(204)
    } catch (error) {
        res.status(404).send({ message: 'Comment not found' })
    }
}
