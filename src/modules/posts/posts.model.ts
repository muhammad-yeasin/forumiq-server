import { Model, Schema, model } from 'mongoose'
import { IPost } from './posts.interface'

type PostModel = Model<IPost>

const postSchema = new Schema<IPost, PostModel>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'UserId is required'],
        },
        thread: {
            type: Schema.Types.ObjectId,
            ref: 'Thread',
            required: [true, 'ThreadId is required'],
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            default: null,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        moderation: {
            isSpam: {
                type: Boolean,
                default: false,
            },
            isInappropriate: {
                type: Boolean,
                default: false,
            },
            reasons: { type: String, default: '' },
        },
    },
    {
        timestamps: true,
    }
)

export const Post = model<IPost, PostModel>('Post', postSchema)
