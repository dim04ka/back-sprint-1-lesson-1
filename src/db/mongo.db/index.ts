import { Collection, Db, MongoClient } from 'mongodb'

import dotenv from 'dotenv'
import { Post } from '../../posts/dto'
import { Blog } from '../../blogs/domain'
import { IUserDB } from '../../users/types/user.db.interface'
import type { Comment } from '../../comments/types/comment'
import mongoose from 'mongoose'
dotenv.config()

const POSTS_COLLECTION_NAME = 'posts'
const BLOGS_COLLECTION_NAME = 'blogs'
const USERS_COLLECTION_NAME = 'users'
const COMMENTS_COLLECTION_NAME = 'comments'

export let client: MongoClient

export let blogsCollection: Collection<Blog>
export let postsCollection: Collection<Post>
// export let usersCollection: Collection<IUserDB>
export let commentsCollection: Collection<Comment>


const UserSchema = new mongoose.Schema<IUserDB>({
    login: { type: String, required: true  },
    email: { type: String, required: true  },
    password: { type: String, required: true  },
    createdAt: { type: Date, required: true  },
    emailConfirmation: {
        confirmationCode: { type: String },
        expirationDate: { type: Date, required: true  },
        isConfirmed: { type: Boolean, required: true  },
    },
});

export const usersCollection = mongoose.model<IUserDB>(USERS_COLLECTION_NAME, UserSchema);


// Подключения к бд
export async function runDB(url: string): Promise<void> {
    // client = new MongoClient(url)
    // const db: Db = client.db(process.env.MONGO_DB_NAME || '')

    // // Инициализация коллекций
    // blogsCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME)
    // postsCollection = db.collection<Post>(POSTS_COLLECTION_NAME)
    // usersCollection = db.collection<IUserDB>(USERS_COLLECTION_NAME)
    // commentsCollection = db.collection<Comment>(
    //     COMMENTS_COLLECTION_NAME
    // )

    try {
        console.log('Connecting to the database...')
        await mongoose.connect(url);
        
        // await client.connect()
        // await db.command({ ping: 1 })
        console.log('✅ Connected to the database')
    } catch (e) {
        await mongoose.disconnect()
        // await client.close()
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
