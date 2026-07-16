import { jwtService } from '../../auth/adapters/jwt.service'
import { Request } from 'express'

export const getUserIdFromToken = async (token: string) => {
    let requestedUserId = null

    const payload = await jwtService.verifyToken(token)

    if (payload) {
        const { userId } = payload
        requestedUserId = userId
    }

    return requestedUserId
}
