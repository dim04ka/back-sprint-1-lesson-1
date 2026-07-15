export type Comment = {
    content: string
    postId: string
    userId: string
    createdAt: string
}

export type CommentInput = Omit<Comment, 'createdAt'>

export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
    likesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: 'Like' | 'Dislike' | 'None'
    }
}
