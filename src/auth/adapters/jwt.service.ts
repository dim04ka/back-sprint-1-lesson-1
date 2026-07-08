import jwt, { type SignOptions } from 'jsonwebtoken'
import { appConfig } from '../../common/config/config'

type RefreshTokenPayload = {
    userId: string
    deviceId: string
    iat: number
    exp: number
}

type CreateTokenOptions = {
    refreshTokenIat?: number
}

export const jwtService = {
    async createToken(
        userId: string,
        deviceId: string,
        options?: CreateTokenOptions
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const accessToken = jwt.sign({ userId }, appConfig.AC_SECRET, {
            expiresIn: appConfig.AC_TIME as SignOptions['expiresIn'],
        })
        const refreshTokenPayload: {
            userId: string
            deviceId: string
            iat?: number
        } = { userId, deviceId }

        if (options?.refreshTokenIat) {
            refreshTokenPayload.iat = options.refreshTokenIat
        }

        const refreshToken = jwt.sign(
            refreshTokenPayload,
            appConfig.RT_SECRET as string,
            {
                expiresIn: appConfig.RT_TIME as SignOptions['expiresIn'],
            }
        )
        return { accessToken, refreshToken }
    },
    async decodeToken(token: string): Promise<any> {
        try {
            return jwt.decode(token)
        } catch (e: unknown) {
            console.error("Can't decode token", e)
            return null
        }
    },
    async verifyToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, appConfig.AC_SECRET) as { userId: string }
        } catch (error) {
            console.error('Token verify some error')
            return null
        }
    },
    async verifyRefreshToken(
        token: string
    ): Promise<RefreshTokenPayload | null> {
        try {
            return jwt.verify(
                token,
                appConfig.RT_SECRET as string
            ) as RefreshTokenPayload
        } catch (error) {
            console.error('Refresh token verify some error')
            return null
        }
    },
}
