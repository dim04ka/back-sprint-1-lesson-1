// export type Post = {
//     id: string
//     title: string
//     shortDescription: string
//     content: string

// }

export type FullPost = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
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
}