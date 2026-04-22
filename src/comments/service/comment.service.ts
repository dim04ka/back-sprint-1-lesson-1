import { WithId } from 'mongodb'
import { PostQueryInput } from '../../posts/routes/input/post-query.input'
import { commentsRepository } from '../repository/comment.repository'
import { Comment } from '../types/comment'
import { DomainError } from '../../core/errors/domain.error'

export const commentsService = {
    async updateComment(id: string, content: string): Promise<void> {
        await commentsRepository.update(id, content)
    },
    async delete(id: string): Promise<void> {
        await commentsRepository.delete(id)
    },
    async findById(id: string): Promise<WithId<Comment>> {
        const comment = await commentsRepository.findById(id)
        if (!comment) {
            throw new DomainError(
                'Comment not found',
                'COMMENT_NOT_FOUND'
            )
        }
        return comment
    },
    async createComment(comment: Comment) {
        return await commentsRepository.create(comment)
    },
    async getCommentsByPostId({
        postId,
        queryDto,
    }: {
        postId: string
        queryDto: PostQueryInput
    }) {
        return await commentsRepository.findMany({ postId, queryDto })
    },
}
