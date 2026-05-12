import jwt, { type SignOptions } from 'jsonwebtoken'
import { appConfig } from '../../common/config/config'

export const jwtService = {
    async createToken(
        userId: string
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const accessToken = jwt.sign({ userId }, appConfig.AC_SECRET, {
            expiresIn: appConfig.AC_TIME as SignOptions['expiresIn'],
        })
        const refreshToken = jwt.sign(
            { userId },
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
    ): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, appConfig.RT_SECRET as string) as {
                userId: string
            }
        } catch (error) {
            console.error('Refresh token verify some error')
            return null
        }
    },
}
