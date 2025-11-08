import authRouter from '@/modules/auth/auth.route'
import threadsRouter from '@/modules/threads/threads.route'
import postsRouter from '@/modules/posts/posts.route'
import notificationsRouter from '@/modules/notifications/notifications.route'
import { Router } from 'express'

const v1Router = Router()

v1Router.use('/auth', authRouter)
v1Router.use('/threads', threadsRouter)
v1Router.use('/posts', postsRouter)
v1Router.use('/notifications', notificationsRouter)

export default v1Router
