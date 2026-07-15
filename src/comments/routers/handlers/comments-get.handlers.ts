import { jwtService } from '../../../auth/adapters/jwt.service'
import {
    usersRepository,
    commentsService,
} from '../../../composition-root'

import { Request, Response } from 'express'

export const commentsGetHandler = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const id = req.params.id

        let requestedUserId = null

        const token = req.headers.authorization?.split(' ')[1]
        if (token) {
            const payload = await jwtService.verifyToken(token)

            if (payload) {
                const { userId } = payload
                requestedUserId = userId
            }
        }

        const comment = await commentsService.findById(id)
        const user = await usersRepository.findById(comment!.userId)
        const likes = await commentsService.findLikesByCommentId(id)
        const likesCount = likes.filter(
            (like) => like.status === 'Like'
        ).length
        const dislikesCount = likes.filter(
            (like) => like.status === 'Dislike'
        ).length
        const myStatus = requestedUserId
            ? (likes.find((like) => like.userId === requestedUserId)
                  ?.status ?? 'None')
            : 'None'

        const commentOutput = {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.userId,
                userLogin: user?.login ?? '',
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: likesCount,
                dislikesCount: dislikesCount,
                myStatus: myStatus,
            },
        }

        res.status(200).send(commentOutput)
    } catch (error) {
        res.status(404).send({ message: 'Comment not found' })
    }
}
