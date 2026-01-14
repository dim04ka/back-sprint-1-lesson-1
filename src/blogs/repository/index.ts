import { db } from '../../db'
import { Blog } from '../dto'

export const blogsRepository = {
    findAll(): Blog[] {
        return db.blogs
    },
    findById(id: string): Blog | undefined {
        return db.blogs.find((b) => b.id === id)
    },
    create(blog: Blog): void {
        db.blogs.push(blog)
    },
    update(blog: Blog): void {
        const foundIndex = db.blogs.findIndex((b) => b.id === blog.id)
        if (foundIndex === -1) {
            throw new Error('Blog not found')
        }
        db.blogs[foundIndex] = blog
    },
    delete(id: string): void {
        const foundIndex = db.blogs.findIndex((b) => b.id === id)
        if (foundIndex === -1) {
            throw new Error('Blog not found')
        }
        db.blogs.splice(foundIndex, 1)
    },
}
