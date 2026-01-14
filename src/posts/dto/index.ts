export type Post = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}

export type CreatePost = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}
