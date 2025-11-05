import { Model, Schema, model, Types } from 'mongoose'
import { IThread } from './threads.interface'

type ThreadModel = Model<IThread>

const threadSchema = new Schema<IThread, ThreadModel>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'UserId is required'],
        },
    },
    {
        timestamps: true,
    }
)

export const Thread = model<IThread, ThreadModel>('Thread', threadSchema)
