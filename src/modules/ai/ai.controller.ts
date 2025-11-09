import { catchAsync } from '@/middlewares'
import { RequestHandler } from 'express'
import aiService from './ai.service'
import AppError from '@/utils/AppError'
import threadService from '../threads/threads.service'

export const summarizeThread: RequestHandler = catchAsync(
    async (req, res, next) => {
        const { threadId } = req.params

        if (!threadId) return next(new AppError('threadId is required', 400))

        const thread = await threadService.getThreadById(threadId)

        if (!thread) return next(new AppError('Thread is not found', 404))

        const prompt = `
        Summarize the following forum thread clearly and concisely in 2–3 sentences. 
        Do not include the title or any unnecessary details — output only the summary itself.

        Thread Title: ${thread.title}

        Thread Content:
        ${thread.content}
        `

        const result = await aiService.generateSummary(prompt)

        res.status(200).json({
            status: 'success',
            message: 'Summary generated',
            data: result,
        })
    }
)

export default {
    summarizeThread,
}
