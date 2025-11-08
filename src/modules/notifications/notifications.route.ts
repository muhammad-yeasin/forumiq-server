import { Router } from 'express'
import { getNotificationsByUser } from './notifications.controller'
import { protect } from '../auth/auth.controller'

const router = Router()

router.get('/', protect, getNotificationsByUser)

export default router
