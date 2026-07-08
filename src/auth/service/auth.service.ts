import { usersRepository } from '../../users/repository/users.repository'
import { bcryptService } from '../adapters/bcrypt.service'
import { jwtService } from '../adapters/jwt.service'

export const authService = {
    async login({
        loginOrEmail,
        password,
        deviceId,
    }: {
        loginOrEmail: string
        password: string
        deviceId: string
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
        const { accessToken, refreshToken } =
            await jwtService.createToken(user._id.toString(), deviceId)

        return {
            accessToken,
            refreshToken,
            user_id: user._id.toString(),
        }
    },
}
