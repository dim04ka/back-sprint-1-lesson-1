import { errorsHandler } from '../../../../core/errors/errors.handler'
import { Request, Response } from 'express'
import { HttpStatus } from '../../../../core/types/http-statuses'
import { jwtService } from '../../../adapters/jwt.service'
import { refreshTokenService } from './composiiton'

export const refreshTokenHandler = async (
    req: Request,
    res: Response
) => {
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
        const refreshTokenChecked =
            await refreshTokenService.findByToken(refreshTokenCookie)
        if (refreshTokenChecked) {
            return res.sendStatus(HttpStatus.Unauthorized)
        }
        debugger

        await refreshTokenService.add(
            payload.userId,
            refreshTokenCookie
        )

        const { accessToken, refreshToken } =
            await jwtService.createToken(payload.userId)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
        })

        return res.send({ accessToken })
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
