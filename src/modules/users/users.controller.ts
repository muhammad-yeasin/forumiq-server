import { catchAsync } from '@/middlewares'
import { RequestHandler } from 'express'
import userService from './user.service'
import AppError from '@/utils/AppError'

export const updateProfile: RequestHandler = catchAsync(
    async (req, res, next) => {
        const userId = (req as any).user?._id

        const { username, email, avatar } = req.body

        const updatePayload: Partial<any> = {}
        if (username) updatePayload.username = username
        if (email) updatePayload.email = email
        if (avatar) updatePayload.avatar = avatar

        const updatedUser = await userService.updateUserById(
            userId,
            updatePayload
        )

        if (!updatedUser) return next(new AppError('User not found', 404))

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: { user: updatedUser },
        })
    }
)
