import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'

import { postsService } from '../../../composition-root'
import { PostSortFields } from '../input/post-sort.input'
import { SortDirection } from '../../../core/types/sort-direction'
import { errorsHandler } from '../../../core/errors/errors.handler'
import { getUserIdFromToken } from '../../../core/helpers/getUserIdFromToken'
import { getExtendedLikesInfo } from '../helpers/get-extended-likes-info'

export const getPostHandler = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        let requestedUserId: string | null = null
        if (token) {
            requestedUserId = await getUserIdFromToken(token)
        }

        const id = req.params.id as string
        const { items } = await postsService.findManyWithBlogName({
            postId: id,
            pageNumber: 1,
            pageSize: 10,
            sortBy: PostSortFields.CreatedAt,
            sortDirection: SortDirection.Desc,
        })
        if (!items.length) {
            return res
                .status(HttpStatus.NotFound)
                .send({ message: 'Post not found' })
        }

        res.status(HttpStatus.Ok).send({
            id: items[0]._id.toString(),
            title: items[0].title,
            shortDescription: items[0].shortDescription,
            content: items[0].content,
            blogId: items[0].blogId,
            blogName: items[0].blogName,
            createdAt: items[0].createdAt,
            extendedLikesInfo: await getExtendedLikesInfo(
                id,
                requestedUserId
            ),
        })
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
