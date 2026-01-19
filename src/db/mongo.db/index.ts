import { Collection, Db, MongoClient } from 'mongodb'

import dotenv from 'dotenv'
import { PostViewModel } from '../../posts/dto'
import { Blog } from '../../blogs/dto'
dotenv.config()

const POSTS_COLLECTION_NAME = 'posts'
const BLOGS_COLLECTION_NAME = 'blogs'

export let client: MongoClient
export let blogsCollection: Collection<Blog>
export let postsCollection: Collection<PostViewModel>

// Подключения к бд
export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url)
    const db: Db = client.db(process.env.MONGO_DB_NAME || '')

    // Инициализация коллекций
    blogsCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME)
    postsCollection = db.collection<PostViewModel>(POSTS_COLLECTION_NAME);

    try {
        console.log('Connecting to the database...')
        await client.connect()
        await db.command({ ping: 1 })
        console.log('✅ Connected to the database')
    } catch (e) {
        await client.close()
        throw new Error(`❌ Database not connected: ${e}`)
    }
}

// для тестов
export async function stopDb() {
    if (!client) {
        throw new Error(`❌ No active client`)
    }
    await client.close()
}
