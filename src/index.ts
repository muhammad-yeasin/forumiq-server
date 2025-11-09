import app from '@/app'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { env } from '@/config/env'
import connectDB from '@/db/connectDB'

const server = createServer(app)

// Initialize Socket.IO with CORS
export const io = new Server(server, {
    cors: {
        origin: env.CORS_ORIGIN,
        credentials: true,
        methods: ['GET', 'POST'],
    },
})

// Socket.IO connection handling
io.on('connection', socket => {
    console.log(`Client connected: ${socket.id}`)

    // Join a thread room
    socket.on('join-thread', (threadId: string) => {
        socket.join(`thread:${threadId}`)
        console.log(`Socket ${socket.id} joined thread:${threadId}`)
    })

    // Leave a thread room
    socket.on('leave-thread', (threadId: string) => {
        socket.leave(`thread:${threadId}`)
        console.log(`Socket ${socket.id} left thread:${threadId}`)
    })

    // Join user notification room
    socket.on('join-user', (userId: string) => {
        socket.join(`user:${userId}`)
        console.log(`Socket ${socket.id} joined user:${userId}`)
    })

    // Leave user notification room
    socket.on('leave-user', (userId: string) => {
        socket.leave(`user:${userId}`)
        console.log(`Socket ${socket.id} left user:${userId}`)
    })

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`)
    })
})

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
