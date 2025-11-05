import { Model, Schema, model } from 'mongoose'
import { IUser } from './users.interface'
import { USER_ROLES, USER_STATUS } from './users.constant'
import { comparePasswords, hashPassword } from '@/utils/bcrypt'

export interface IUserMethods {
    isPasswordMatched(password: string): Promise<boolean>
}

type UserModel = Model<IUser, {}, IUserMethods>

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false,
        },
        avatar: {
            type: String,
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            default: 'user',
        },
        status: {
            type: String,
            enum: Object.values(USER_STATUS),
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
)

userSchema.pre('save', async function (next) {
    this.password = await hashPassword(this.password)
    next()
})

userSchema.methods.isPasswordMatched = async function (password: string) {
    return await comparePasswords(password, this.password)
}

export const User = model<IUser, UserModel>('User', userSchema)
