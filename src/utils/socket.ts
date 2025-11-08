import { io } from '@/index'
import { IPostWithChildren } from '@/modules/posts/posts.interface'

export const emitNewPost = (threadId: string, post: IPostWithChildren) => {
    io.to(`thread:${threadId}`).emit('new-post', post)
}

export const emitNewNotification = (userId: string, notification: any) => {
    io.to(`user:${userId}`).emit('new-notification', notification)
}

export const socketService = {
    emitNewPost,
    emitNewNotification,
}
