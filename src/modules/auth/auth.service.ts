import userService from '@/modules/users/user.service'

const authService = {
    createUser: userService.createUser,
    getUserByEmail: userService.getUserByEmail,
    getUserById: userService.getUserById,
}
export default authService
