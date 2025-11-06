import { Router } from 'express'
import { createPost, getPostsByThread } from './posts.controller'
import { protect } from '@/modules/auth/auth.controller'

const postsRouter = Router()

postsRouter.post('/', protect, createPost)
postsRouter.get('/:threadId', getPostsByThread)

export default postsRouter
