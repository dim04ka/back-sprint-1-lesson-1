import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'

import { postService } from '../../application/post.service'
import { PostSortFields } from '../input/post-sort.input'
import { SortDirection } from '../../../core/types/sort-direction'
import { errorsHandler } from '../../../core/errors/errors.handler'

export const getPostHandler = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const { items } = await postService.findManyWithBlogName({
            postId: id as string,
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

        res.status(HttpStatus.Ok).send(items[0])
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
