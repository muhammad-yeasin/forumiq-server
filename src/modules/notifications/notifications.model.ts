import { Model, Schema, model } from 'mongoose'
import { INotification, NotificationType } from './notifications.interface'

type NotificationModel = Model<INotification>

const VALID_TYPES: NotificationType[] = ['posted', 'mentioned', 'replied']

const notificationSchema = new Schema<INotification, NotificationModel>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required'],
        },
        thread: {
            type: Schema.Types.ObjectId,
            ref: 'Thread',
            required: [true, 'Thread is required'],
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            default: null,
        },
        type: {
            type: String,
            enum: {
                values: VALID_TYPES,
                message: 'Invalid notification type',
            },
            required: [true, 'Type is required'],
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
)

notificationSchema.pre('validate', function (next) {
    if (this.type === 'replied' && !this.post) {
        this.invalidate('post', 'post is required when type is replied')
    }
    next()
})

export const Notification = model<INotification, NotificationModel>(
    'Notification',
    notificationSchema
)
