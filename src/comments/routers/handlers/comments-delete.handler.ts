import { Request, Response } from 'express'
import { commentsService } from '../../../composition-root'

export const commentsDeleteHandler = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const userId = req.user!.id
    const comment = res.locals.comment as Awaited<
        ReturnType<typeof commentsService.findById>
    >

    if (comment.userId !== userId) {
        return res.status(403).send({ message: 'Forbidden' })
    }

    await commentsService.delete(req.params.id)
    res.sendStatus(204)
}
