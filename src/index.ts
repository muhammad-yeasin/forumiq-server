import app from '@/app'
import { createServer } from 'http'
import { env } from '@/config/env'
import connectDB from '@/db/connectDB'

const server = createServer(app)

const main = async () => {
    try {
        await connectDB()
        server.listen(env.PORT, () => {
            console.log(`server listening on ${env.PORT}`)
        })
    } catch (err) {
        console.log(`server connection failed ☹️`)
        console.log(err)
    }
}

main()
