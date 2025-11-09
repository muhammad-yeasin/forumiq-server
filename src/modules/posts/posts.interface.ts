import { Types } from 'mongoose'

export interface IPost {
    user: Types.ObjectId
    thread: Types.ObjectId
    parent?: Types.ObjectId | null
    content: string
    moderation?: {
        isSpam: boolean
        isInappropriate: boolean
        reasons: string
    }
    createdAt?: Date
    updatedAt?: Date
}

export interface IPostWithChildren extends IPost {
    _id: Types.ObjectId
    children?: IPostWithChildren[]
}
