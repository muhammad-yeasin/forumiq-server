import { IUser } from './users.interface'
import { User } from './users.model'

const createUser = (data: IUser) => {
    return User.create(data)
}

const userService = {
    createUser,
}
export default userService
