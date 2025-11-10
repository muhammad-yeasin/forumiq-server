import mongoose from 'mongoose'
import 'dotenv/config'

process.env.NODE_ENV = 'test'
process.env.DATABASE_URL =
    process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/forumiq_test'
process.env.ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET || 'test-secret'
process.env.ACCESS_TOKEN_EXPIRES_IN =
    process.env.ACCESS_TOKEN_EXPIRES_IN || '1h'

export const setupDatabase = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.DATABASE_URL!)
    }
}

export const clearDatabase = async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
        const collection = collections[key]
        try {
            await collection.deleteMany({})
        } catch (err) {
            // ignore
        }
    }
}

export const teardownDatabase = async () => {
    try {
        await mongoose.connection.dropDatabase()
    } catch (err) {
        // ignore
    }
    await mongoose.connection.close()
}

beforeAll(async () => {
    await setupDatabase()
})

afterEach(async () => {
    await clearDatabase()
})

afterAll(async () => {
    await teardownDatabase()
})
