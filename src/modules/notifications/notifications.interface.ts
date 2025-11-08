import { Types } from 'mongoose'

export type NotificationType = 'posted' | 'mentioned' | 'replied'

export interface INotification {
    user: Types.ObjectId
    thread: Types.ObjectId
    post?: Types.ObjectId | null
    type: NotificationType
    message: string
    isRead: boolean
    createdAt?: Date
    updatedAt?: Date
}
