import { catchAsync } from '@/middlewares'
import { RequestHandler } from 'express'
import authService from './auth.service'
import AppError from '@/utils/AppError'

export const signupWithEmail: RequestHandler = catchAsync(async (req, res) => {
    const { username, email, password } = req.body

    const user = await authService.createUser({
        username,
        email,
        password,
    })

    if (!user) {
        throw new AppError('Failed to signup, Please try again', 400)
    }

    res.status(201).json({
        status: 'success',
        message: 'Signup successful',
    })
})
