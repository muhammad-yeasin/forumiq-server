import { catchAsync } from '@/middlewares'
import { RequestHandler } from 'express'
import threadService from './threads.service'
import AppError from '@/utils/AppError'
import ApiFeatures from '@/utils/apiFeatures'
import { refineQuery } from '@/utils/query'

export const createThread: RequestHandler = catchAsync(
    async (req, res, next) => {
        const { title, content } = req.body
        const userId = (req as any).user?._id

        const thread = await threadService.createThread({
            title,
            content,
            user: userId,
        })

        if (!thread) {
            return next(
                new AppError('Failed to create thread, Please try again', 400)
            )
        }

        res.status(201).json({
            status: 'success',
            message: 'Thread created successfully',
            data: { thread },
        })
    }
)

export const getThreadById = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const thread = await threadService.getThreadById(id)

    if (!thread) return next(new AppError('Thread not found', 404))

    res.status(200).json({
        status: 'success',
        message: 'Thread fetched successfully',
        data: { thread },
    })
})

export const getThreads: RequestHandler = catchAsync(async (req, res) => {
    const query = {
        page: '1',
        limit: '10',
        ...req.query,
    } as any
    const extraQuery = query.search
        ? { title: { $regex: query.search, $options: 'i' } }
        : {}
    const features = new ApiFeatures(threadService.getThreads(), query)
        .filter(extraQuery)
        .sort()
        .limitFields()
        .populate('user', 'username avatar')
        .paginate()

    const threads = await features.query
    const currentPage = +query.page
    const limit = +query.limit

    const totalItems = await threadService.getCountThreads({
        ...refineQuery(query),
        ...extraQuery,
    })
    const totalPages = Math.ceil(totalItems / limit)
    const hasNextPage = totalPages > currentPage
    const hasPrevPage = currentPage > 1 && totalPages > 1

    res.status(200).json({
        status: 'success',
        message: 'Threads fetched successfully',
        pagination: {
            totalItems,
            currentPage,
            limit,
            totalPages,
            hasNextPage,
            hasPrevPage,
        },
        data: {
            threads,
        },
    })
})
