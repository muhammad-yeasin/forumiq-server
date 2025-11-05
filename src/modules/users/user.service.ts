import { IUser } from './users.interface'
import { User } from './users.model'

const createUser = (data: IUser) => {
    return User.create(data)
}

const getUserByEmail = (email: string, withPassword = false) => {
    if (withPassword) {
        return User.findOne({ email }).select('+password')
    }
    return User.findOne({ email })
}

const userService = {
    createUser,
    getUserByEmail,
}
export default userService
