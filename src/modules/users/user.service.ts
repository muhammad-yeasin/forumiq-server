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

const getUserById = (id: string) => {
    return User.findById(id)
}

const updateUserById = (id: string, data: Partial<IUser>) => {
    // Only update provided fields; run validators and return the updated document
    return User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    })
}

const userService = {
    createUser,
    getUserByEmail,
    getUserById,
    updateUserById,
}
export default userService
