import { usersRepository } from '../../users/repository/users.repository'
import { bcryptService } from '../adapters/bcrypt.service'

export const authService = {
    async login({
        loginOrEmail,
        password,
    }: {
        loginOrEmail: string
        password: string
    }) {
        const user =
            await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const isPasswordCorrect = await bcryptService.checkPassword(
            password,
            user.password
        )
        if (!isPasswordCorrect) {
            return null
        }
        return { accessToken: 'token' }
    },
}
