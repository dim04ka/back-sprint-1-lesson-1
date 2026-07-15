import { Request, Response } from 'express'

import { jwtService } from '../../../auth/adapters/jwt.service'
import { errorsHandler } from '../../../core/errors/errors.handler'
import { HttpStatus } from '../../../core/types/http-statuses'
import { securityDevicesService } from '../../../composition-root'

export const deleteOtherSecurityDevicesHandler = async (
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

        await securityDevicesService.deleteOtherSecurityDevices(
            payload.userId,
            payload.deviceId
        )

        return res.sendStatus(HttpStatus.NoContent)
    } catch (error) {
        errorsHandler(error, res)
    }
}
