export type Post = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    createdAt: string
}

export type FullPost = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type ExtendedLikesInfo = {
    likesCount: number
    dislikesCount: number
    myStatus: string
    newestLikes: {
        addedAt: string
        userId: string
        login: string
    }[]
}

export type CreatePost = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type PostViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo?: ExtendedLikesInfo
}
