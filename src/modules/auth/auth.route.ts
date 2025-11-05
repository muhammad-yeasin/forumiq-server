import { Router } from 'express'
import { signupWithEmail } from './auth.controller'

const authRouter = Router()

authRouter.post('/signup', signupWithEmail)

export default authRouter
