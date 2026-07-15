import mongoose from 'mongoose'

import dotenv from 'dotenv'

dotenv.config()

const mongoUri = process.env.MONGO_CONNECT_URL || ''
const mongoDbName = process.env.MONGO_DB_NAME || ''
export async function runDB(): Promise<void> {
    try {
        console.log('Connecting to the database...')
        await mongoose.connect(mongoUri, { dbName: mongoDbName })
        console.log('✅ Connected to the database')
    } catch (e) {
        mongoose.connection.close()
        throw new Error(`❌ Database not connected: ${e}`)
    }
}

// для тестов
export async function stopDb() {
    if (!mongoose.connection.readyState) {
        throw new Error(`❌ No active client`)
    }
    await mongoose.connection.close()
}
