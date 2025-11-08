import { Router } from 'express'
import { protect } from '@/modules/auth/auth.controller'
import { updateProfile } from './users.controller'

const usersRouter = Router()

usersRouter.route('/profile').patch(protect, updateProfile)

export default usersRouter
