import { catchAsync } from '@/middlewares'
import { RequestHandler } from 'express'
import postService from './posts.service'
import AppError from '@/utils/AppError'

export const createPost: RequestHandler = catchAsync(async (req, res, next) => {
    const { thread, parent, content } = req.body
    const userId = (req as any).user?._id

    const post = await postService.createPost({
        user: userId,
        thread: thread,
        parent: parent || null,
        content,
    })

    if (!post) {
        return next(
            new AppError('Failed to create post, Please try again', 400)
        )
    }

    res.status(201).json({
        status: 'success',
        message: 'Post created successfully',
        data: { post },
    })
})

export const getPostsByThread = catchAsync(async (req, res) => {
    const { threadId } = req.params

    const posts = await postService.getPostsByThread(threadId)

    res.status(200).json({
        status: 'success',
        message: 'Posts fetched successfully',
        data: { posts },
    })
})
