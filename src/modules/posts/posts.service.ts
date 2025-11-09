import { Post } from './posts.model'
import { IPost, IPostWithChildren } from './posts.interface'
import { Types } from 'mongoose'
import notificationService from '../notifications/notifications.service'
import threadService from '../threads/threads.service'
import aiService from '../ai/ai.service'

const createPost = (data: IPost) => {
    return Post.create(data)
}

const getPostsByThread = async (threadId: string) => {
    const docs = await Post.find({ thread: new Types.ObjectId(threadId) })
        .populate('user', 'username avatar')
        .sort({ createdAt: 1 })
        .lean()

    // Build map of id -> node
    const map = new Map<string, IPostWithChildren>()
    const roots: IPostWithChildren[] = []

    for (const d of docs) {
        const node: IPostWithChildren = {
            _id: (d as any)._id,
            user: (d as any).user,
            thread: (d as any).thread,
            parent: (d as any).parent || null,
            content: (d as any).content,
            createdAt: (d as any).createdAt,
            updatedAt: (d as any).updatedAt,
            moderation: (d as any).moderation,
            children: [],
        }
        map.set(String(node._id), node)
    }

    for (const node of map.values()) {
        if (node.parent) {
            const parent = map.get(String(node.parent))
            if (parent) {
                parent.children = parent.children || []
                parent.children.push(node)
            } else {
                // parent not found (maybe deleted) -> treat as root
                roots.push(node)
            }
        } else {
            roots.push(node)
        }
    }

    return roots
}

const getPostOwnerId = async (postId: string) => {
    const post = await Post.findById(postId).select('user').lean()
    return post ? post.user.toString() : null
}

const moderatePost = async ({
    postId,
    content,
    threadId,
}: {
    postId: string
    content: string
    threadId: string
}) => {
    const thread = await threadService.getThreadById(threadId)
    // 👇 Refined moderation prompt
    const prompt = `
    You are a content moderation AI assistant for an online discussion platform.

    Analyze the following post content and decide:
    1. Whether it contains spam or promotional content.
    2. Whether it contains inappropriate content with thread context.
    3. Give a short reason for your judgment.

    Respond strictly in JSON format like this:
    {
      "isSpam": true | false,
      "isInappropriate": true | false,
      "reason": "short explanation"
    }
    
    Thread Title:
    "${thread?.title}"

    Thread Content:
    "${thread?.content}"

    Post Content:
    "${content}"
    `
    const response = await aiService.generateSummary(prompt)

    if (!response) return null

    const formattedResponse = response.match(/\{[\s\S]*\}/)
    if (!formattedResponse) return null

    const parsed = JSON.parse(formattedResponse[0])
    console.log('moderation response:🔥', parsed)

    // const { isSpam, isInappropriate, reasons } = response

    await Post.findByIdAndUpdate(postId, {
        moderation: {
            isSpam: parsed?.isSpam || false,
            isInappropriate: parsed?.isInappropriate || false,
            reasons: parsed?.reason ? parsed.reason : '',
        },
    })

    return response
}

const postService = {
    createPost,
    getPostsByThread,
    moderatePost,
    createNotification: notificationService.createNotification,
    getThreadById: threadService.getThreadById,
    getPostOwnerId,
    getThreadOwnerId: threadService.getThreadOwnerId,
}

export default postService
