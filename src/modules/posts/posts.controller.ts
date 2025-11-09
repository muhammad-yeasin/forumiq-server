import { catchAsync } from '@/middlewares'
import { RequestHandler } from 'express'
import postService from './posts.service'
import AppError from '@/utils/AppError'
import { socketService } from '@/utils/socket'
import { Types } from 'mongoose'
import { Post } from './posts.model'

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

    // Run moderation in the background; when it completes we will fetch the
    // updated post and emit an "update-post" event so clients update their
    // UI in realtime. Do not await here so the HTTP flow stays fast.
    postService
        .moderatePost({
            postId: post._id.toString(),
            content,
            threadId: thread,
        })
        .then(async () => {
            try {
                // Re-fetch the updated post with user populated so clients
                // receive a consistent object shape.
                const updatedDoc = await Post.findById(post._id)
                    .populate('user', 'username avatar')
                    .lean()

                if (updatedDoc) {
                    const updatedPost = {
                        _id: (updatedDoc as any)._id,
                        user: (updatedDoc as any).user,
                        thread: (updatedDoc as any).thread,
                        parent: (updatedDoc as any).parent || null,
                        content: (updatedDoc as any).content,
                        createdAt: (updatedDoc as any).createdAt,
                        updatedAt: (updatedDoc as any).updatedAt,
                        moderation: (updatedDoc as any).moderation,
                        children: [],
                    }

                    socketService.emitUpdatedPost(thread, updatedPost as any)
                }
            } catch (err) {
                console.error(
                    'Error emitting updated post after moderation',
                    err
                )
            }
        })
        .catch(err => {
            console.error('Moderation error', err)
        })

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

    socketService.emitNewPost(
        thread,
        (await post.populate('user', 'username avatar')) as any
    )

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
