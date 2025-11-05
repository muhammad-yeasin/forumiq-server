import { env } from '@/config/env'
import { connect } from 'mongoose'

const connectDB = async () => {
    await connect(env.DATABASE_URL)
    console.log('db connection established 🔥')
}

export default connectDB
