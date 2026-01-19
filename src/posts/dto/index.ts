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

export type Post = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}
