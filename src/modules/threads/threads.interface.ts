import { Types } from 'mongoose'

export interface IThread {
    title: string
    content: string
    user: Types.ObjectId
}
