import { catchAsync } from '@/middlewares'
import { RequestHandler } from 'express'
import notificationService from './notifications.service'
import ApiFeatures from '@/utils/apiFeatures'
import { refineQuery } from '@/utils/query'

export const getNotificationsByUser: RequestHandler = catchAsync(
    async (req, res) => {
        const userId = (req as any).user?._id

        const query = {
            page: '1',
            limit: '10',
            ...req.query,
        } as any

        const extraQuery = { user: userId }

        const features = new ApiFeatures(
            notificationService.getNotifications(),
            query
        )
            .filter(extraQuery)
            .sort()
            .limitFields()
            .paginate()

        const notifications = await features.query

        const currentPage = +query.page
        const limit = +query.limit

        const totalItems = await notificationService.getCountNotifications({
            ...refineQuery(query),
            ...extraQuery,
        })
        const totalPages = Math.ceil(totalItems / limit)
        const hasNextPage = totalPages > currentPage
        const hasPrevPage = currentPage > 1 && totalPages > 1

        res.status(200).json({
            status: 'success',
            message: 'Notifications fetched successfully',
            pagination: {
                totalItems,
                currentPage,
                limit,
                totalPages,
                hasNextPage,
                hasPrevPage,
            },
            data: { notifications },
        })
    }
)
