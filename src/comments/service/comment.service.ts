import { WithId } from 'mongodb'
import { PostQueryInput } from '../../posts/routes/input/post-query.input'
import { CommentsRepository } from '../repository/comment.repository'
import { Comment } from '../types/comment'
import { DomainError } from '../../core/errors/domain.error'
import { LikeRepository } from '../repository/like.repository'

export class CommentsService {
    constructor(
        private readonly commentsRepository: CommentsRepository,
        private readonly likesRepository: LikeRepository
    ) {}
    async updateComment(id: string, content: string): Promise<void> {
        await this.commentsRepository.update(id, content)
    }
    async delete(id: string): Promise<void> {
        await this.commentsRepository.delete(id)
    }
    async findById(id: string): Promise<WithId<Comment>> {
        const comment = await this.commentsRepository.findById(id)
        if (!comment) {
            throw new DomainError(
                'Comment not found',
                'COMMENT_NOT_FOUND'
            )
        }
        return comment
    }
    async createComment(comment: Comment) {
        return await this.commentsRepository.create(comment)
    }
    async getCommentsByPostId({
        postId,
        queryDto,
    }: {
        postId: string
        queryDto: PostQueryInput
    }) {
        return await this.commentsRepository.findMany({
            postId,
            queryDto,
        })
    }
    async findLikesByCommentId(commentId: string) {
        return await this.likesRepository.findLikesByCommentId(
            commentId
        )
    }
    async createLikeStatus(
        commentId: string,
        userId: string,
        likeStatus: 'Like' | 'Dislike' | 'None'
    ) {
        return await this.likesRepository.createLikeStatus(
            commentId,
            userId,
            likeStatus
        )
    }
    async updateCommentLikeStatus(
        commentId: string,
        likeStatus: 'Like' | 'Dislike' | 'None'
    ) {
        return await this.likesRepository.updateLikeStatus(
            commentId,
            likeStatus
        )
    }
}
