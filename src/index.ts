import app from '@/app'
import { createServer } from 'http'
import { env } from '@/config/env'

const server = createServer(app)

const main = async () => {
    try {
        server.listen(env.PORT, () => {
            console.log(`server listening on ${env.PORT}`)
        })
    } catch (err) {
        console.log(`server connection failed ☹️`)
        console.log(err)
    }
}

main()
