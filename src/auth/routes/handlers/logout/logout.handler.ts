import { HttpStatus } from '../../../../core/types/http-statuses'
import { Request, Response } from 'express'
import { errorsHandler } from '../../../../core/errors/errors.handler'
import { jwtService } from '../../../adapters/jwt.service'
import { refreshTokenService } from '../refresh-token/composiiton'

export const logoutHandler = async (req: Request, res: Response) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken
        if (!refreshTokenCookie) {
            return res.sendStatus(HttpStatus.Unauthorized)
        }
        const payload = await jwtService.verifyRefreshToken(
            refreshTokenCookie
        )
        if (!payload) {
            return res.sendStatus(HttpStatus.Unauthorized)
        }

        await refreshTokenService.add(
            payload.userId,
            refreshTokenCookie
        )
        res.clearCookie('refreshToken')
        return res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
