import userService from '@/modules/users/user.service'

const authService = {
    createUser: userService.createUser,
    getUserByEmail: userService.getUserByEmail,
}
export default authService
