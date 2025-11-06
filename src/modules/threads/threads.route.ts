import { Router } from 'express'
import { createThread, getThreadById, getThreads } from './threads.controller'
import { protect } from '@/modules/auth/auth.controller'

const threadsRouter = Router()

threadsRouter.route('/').post(protect, createThread).get(getThreads)
threadsRouter.route('/:id').get(getThreadById)

export default threadsRouter
