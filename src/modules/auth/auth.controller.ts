import { catchAsync } from '@/middlewares'
import { RequestHandler } from 'express'
import authService from './auth.service'
import AppError from '@/utils/AppError'
import { decodeJwt, generateJwt, verifyJwt } from '@/utils/jwt'
import { env } from '@/config/env'

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

export const signinWithEmail: RequestHandler = catchAsync(
    async (req, res, next) => {
        const { email, password } = req.body

        // check if user exists
        const user = await authService.getUserByEmail(email, true)

        if (!user) {
            return next(new AppError('Invalid email or password', 401))
        }

        // check if password is correct
        const isPasswordMatched = await user.isPasswordMatched(password)

        if (!isPasswordMatched) {
            return next(new AppError('Invalid email or password', 401))
        }

        delete (user as any)?._doc?.password

        // create access token
        const accessToken = generateJwt(
            { id: user._id },
            env.ACCESS_TOKEN_SECRET,
            env.ACCESS_TOKEN_EXPIRES_IN
        )

        const decoded = decodeJwt(accessToken)

        // send response
        res.status(200).json({
            status: 'success',
            message: 'Logged in successfully',
            data: {
                user: user,
                accessToken,
                exp: decoded.exp,
            },
        })
    }
)

export const protect = catchAsync(async (req, __, next) => {
    const token =
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : undefined

    if (!token) {
        return next(new AppError('You are not logged in!', 401))
    }
    const decoded = await verifyJwt(token, env.ACCESS_TOKEN_SECRET)

    const user = await authService.getUserById(decoded.id)

    if (!user) {
        return next(new AppError('No user exists with this token!', 401))
    }
    ;(req as any).user = user
    next()
})
