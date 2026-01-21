import { WithId } from 'mongodb'
import { PostViewModel } from '../dto'
import { Blog } from '../../blogs/domain'

export const postViewModelMapper = (
    post: WithId<PostViewModel>,
    blog: WithId<Blog>
): PostViewModel => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: blog.name,
        createdAt: post.createdAt,
    }
}
