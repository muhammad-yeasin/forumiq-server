import { Router } from 'express'
import { signinWithEmail, signupWithEmail } from './auth.controller'

const authRouter = Router()

authRouter.post('/signup', signupWithEmail)
authRouter.post('/signin', signinWithEmail)

export default authRouter
