import { Router } from 'express'
import { createThread, getThreadById, getThreads } from './threads.controller'
import { protect } from '@/modules/auth/auth.controller'

const threadRouter = Router()

threadRouter.route('/').post(protect, createThread).get(getThreads)
threadRouter.route('/:id').get(getThreadById)

export default threadRouter
