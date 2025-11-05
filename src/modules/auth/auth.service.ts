import userService from '@/modules/users/user.service'

const authService = {
    createUser: userService.createUser,
}
export default authService
