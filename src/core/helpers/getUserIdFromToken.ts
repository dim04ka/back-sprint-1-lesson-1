import { jwtService } from '../../auth/adapters/jwt.service'

export const getUserIdFromToken = async (token: string) => {
    const { userId } = (await jwtService.verifyToken(token)) as {
        userId: string
    }

    return userId
}
