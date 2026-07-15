import { errorsHandler } from '../../../../core/errors/errors.handler'
import { Request, Response } from 'express'
import { HttpStatus } from '../../../../core/types/http-statuses'
import { jwtService } from '../../../adapters/jwt.service'
import { securityDevicesService } from '../../../../composition-root'

const getJwtDate = (seconds: number): Date => new Date(seconds * 1000)

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

        const isRefreshSessionValid =
            await securityDevicesService.validateRefreshSession({
                userId: payload.userId,
                deviceId: payload.deviceId,
                iat: getJwtDate(payload.iat),
            })
        if (!isRefreshSessionValid) {
            return res.sendStatus(HttpStatus.Unauthorized)
        }

        const { accessToken, refreshToken } =
            await jwtService.createToken(
                payload.userId,
                payload.deviceId,
                {
                    refreshTokenIat: Math.max(
                        Math.floor(Date.now() / 1000),
                        payload.iat + 1
                    ),
                }
            )

        const newPayload = await jwtService.decodeToken(refreshToken)
        if (
            !newPayload ||
            typeof newPayload.iat !== 'number' ||
            typeof newPayload.exp !== 'number'
        ) {
            return res.sendStatus(HttpStatus.Unauthorized)
        }

        const isSecurityDeviceUpdated =
            await securityDevicesService.updateSecurityDeviceIat({
                deviceId: payload.deviceId,
                currentIat: getJwtDate(payload.iat),
                newIat: getJwtDate(newPayload.iat),
                exp: getJwtDate(newPayload.exp),
            })
        if (!isSecurityDeviceUpdated) {
            return res.sendStatus(HttpStatus.Unauthorized)
        }

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
        })

        return res.send({ accessToken })
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
