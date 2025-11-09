import authRouter from '@/modules/auth/auth.route'
import threadsRouter from '@/modules/threads/threads.route'
import postsRouter from '@/modules/posts/posts.route'
import notificationsRouter from '@/modules/notifications/notifications.route'
import usersRouter from '@/modules/users/users.route'
import aiRouter from '@/modules/ai/ai.route'
import { Router } from 'express'

const v1Router = Router()

v1Router.use('/auth', authRouter)
v1Router.use('/threads', threadsRouter)
v1Router.use('/posts', postsRouter)
v1Router.use('/notifications', notificationsRouter)
v1Router.use('/users', usersRouter)
v1Router.use('/ai', aiRouter)

export default v1Router
