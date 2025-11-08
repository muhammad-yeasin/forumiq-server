import { io } from '@/index'
import { IPostWithChildren } from '@/modules/posts/posts.interface'

export const emitNewPost = (threadId: string, post: IPostWithChildren) => {
    io.to(`thread:${threadId}`).emit('new-post', post)
}

export const socketService = {
    emitNewPost,
}
