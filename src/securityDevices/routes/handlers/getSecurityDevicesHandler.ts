import { jwtService } from '../../../auth/adapters/jwt.service'
import { errorsHandler } from '../../../core/errors/errors.handler'
import { HttpStatus } from '../../../core/types/http-statuses'
import { Request, Response } from 'express'
import { securityDevicesService } from '../../../composition-root'

export const getSecurityDevicesHandler = async (
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

        const securityDevices =
            await securityDevicesService.getSecurityDevices(
                payload.userId
            )

        const mappedSecurityDevices = securityDevices.map(
            (device) => ({
                ip: device.ip,
                title: device.device_name,
                lastActiveDate: device.iat,
                deviceId: device.device_id,
            })
        )
        res.status(HttpStatus.Ok).send(mappedSecurityDevices)
    } catch (error) {
        errorsHandler(error, res)
    }
}
