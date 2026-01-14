import { db } from '../../db'
import { Post } from '../dto'

export const postsRepository = {
    findAll(): Post[] {
        return db.posts
    },
    findById(id: number): Post | undefined {
        return db.posts.find((p) => p.id === id)
    },
    create(post: Post): void {
        db.posts.push(post)
    },
    update(post: Post): void {
        const foundIndex = db.posts.findIndex((p) => p.id === post.id)
        if (foundIndex === -1) {
            throw new Error('Post not found')
        }
        db.posts[foundIndex] = post
    },
    delete(id: number): void {
        const foundIndex = db.posts.findIndex((p) => p.id === id)
        if (foundIndex === -1) {
            throw new Error('Blog not found')
        }
        db.blogs.splice(foundIndex, 1)
    },
}
