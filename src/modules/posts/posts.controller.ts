import { catchAsync } from '@/middlewares'
import { RequestHandler } from 'express'
import postService from './posts.service'
import AppError from '@/utils/AppError'
import { socketService } from '@/utils/socket'
import { Types } from 'mongoose'

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

    const type = parent ? 'replied' : 'posted'
    const threadOwnerId = await postService.getThreadOwnerId(thread)
    const postOwnerId = parent ? await postService.getPostOwnerId(parent) : null

    const notifyUserIds = new Set<string>()
    if (threadOwnerId && threadOwnerId !== userId.toString()) {
        notifyUserIds.add(threadOwnerId)
    }
    if (postOwnerId && postOwnerId !== userId.toString()) {
        notifyUserIds.add(postOwnerId)
    }

    for (const notifyUserId of notifyUserIds) {
        const notification = await postService.createNotification({
            user: new Types.ObjectId(notifyUserId),
            thread,
            post: parent || null,
            type,
            message:
                type === 'posted'
                    ? `${(req as any).user.username} posted in your thread.`
                    : `${(req as any).user.username} replied to your post.`,
            isRead: false,
        })
        socketService.emitNewNotification(notifyUserId, notification)
    }

    socketService.emitNewPost(thread, post as any)

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
