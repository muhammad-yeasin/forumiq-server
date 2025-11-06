import { Types } from 'mongoose'

export interface IPost {
    user: Types.ObjectId
    thread: Types.ObjectId
    parent?: Types.ObjectId | null
    content: string
    createdAt?: Date
    updatedAt?: Date
}

export interface IPostWithChildren extends IPost {
    _id: Types.ObjectId
    children?: IPostWithChildren[]
}
