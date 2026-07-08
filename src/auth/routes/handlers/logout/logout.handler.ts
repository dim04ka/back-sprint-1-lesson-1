import { HttpStatus } from '../../../../core/types/http-statuses'
import { Request, Response } from 'express'
import { errorsHandler } from '../../../../core/errors/errors.handler'
import { jwtService } from '../../../adapters/jwt.service'
import { securityDevicesService } from '../../../../securityDevices/services/securityDevices.service'

const getJwtDate = (seconds: number): Date => new Date(seconds * 1000)

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

        const isSecurityDeviceDeleted =
            await securityDevicesService.deleteSecurityDeviceByDeviceIdAndIat({
                deviceId: payload.deviceId,
                iat: getJwtDate(payload.iat),
            })
        if (!isSecurityDeviceDeleted) {
            return res.sendStatus(HttpStatus.Unauthorized)
        }

        res.clearCookie('refreshToken')
        return res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
