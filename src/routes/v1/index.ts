import authRouter from '@/modules/auth/auth.route'
import threadsRouter from '@/modules/threads/threads.route'
import postsRouter from '@/modules/posts/posts.route'
import { Router } from 'express'

const v1Router = Router()

v1Router.use('/auth', authRouter)
v1Router.use('/threads', threadsRouter)
v1Router.use('/posts', postsRouter)

export default v1Router
