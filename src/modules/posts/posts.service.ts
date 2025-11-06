import { Post } from './posts.model'
import { IPost, IPostWithChildren } from './posts.interface'
import { Types } from 'mongoose'

const createPost = (data: IPost) => {
    return Post.create(data)
}

const getPostsByThread = async (threadId: string) => {
    const docs = await Post.find({ thread: new Types.ObjectId(threadId) })
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

const postService = {
    createPost,
    getPostsByThread,
}

export default postService
