import { postsRepository } from '../repository'
import { CreatePost, Post, PostViewModel } from '../dto'
import { PostQueryInput } from '../routes/input/post-query.input'
import { WithId } from 'mongodb'

export const postService = {
    async findById(id: string): Promise<WithId<Post>> {
        return postsRepository.findById(id)
    },
    async findManyWithBlogName(
        queryDto: PostQueryInput & { postId?: string }
    ): Promise<{
        items: WithId<PostViewModel>[]
        totalCount: number
    }> {
        return postsRepository.findManyWithBlogName(queryDto)
    },
    async create(
        post: CreatePost & { createdAt: string }
    ): Promise<{ id: string }> {
        return await postsRepository.create(post)
    },
    async delete(id: string): Promise<void> {
        await postsRepository.delete(id)
        return
    },
    async update({
        id,
        post,
    }: {
        id: string
        post: CreatePost
    }): Promise<void> {
        await postsRepository.update({ id, post })
        return
    },
}
