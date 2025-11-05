import { Document } from 'mongoose'
import { UserRole, UserStatus } from './users.constant'

export interface IUser extends Document {
    username: string
    email: string
    password: string
    avatar?: string
    role?: UserRole
    status?: UserStatus
}
