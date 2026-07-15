import { PostsRepository } from '../repository'
import { CreatePost, Post, PostViewModel } from '../dto'
import { PostQueryInput } from '../routes/input/post-query.input'
import { WithId } from 'mongodb'

export class PostsService {
    constructor(private readonly postsRepository: PostsRepository) {}
    async findById(id: string): Promise<WithId<Post>> {
        return this.postsRepository.findById(id)
    }
    async findManyWithBlogName(
        queryDto: PostQueryInput & {
            postId?: string
            blogId?: string
        }
    ): Promise<{
        items: WithId<PostViewModel>[]
        totalCount: number
    }> {
        return this.postsRepository.findManyWithBlogName(queryDto)
    }
    async create(
        post: CreatePost & { createdAt: string }
    ): Promise<{ id: string }> {
        return await this.postsRepository.create(post)
    }
    async delete(id: string): Promise<void> {
        await this.postsRepository.delete(id)
        return
    }
    async update({
        id,
        post,
    }: {
        id: string
        post: CreatePost
    }): Promise<void> {
        await this.postsRepository.update({ id, post })
        return
    }
}
