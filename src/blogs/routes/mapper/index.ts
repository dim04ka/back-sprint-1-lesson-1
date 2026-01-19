import { Blog, BlogViewModel } from "../../dto"
import { WithId } from "mongodb"

export const blogViewModelMapper = (blog: WithId<Blog>): BlogViewModel => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    }
}