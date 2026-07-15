import { Request, Response } from 'express'

import { jwtService } from '../../../auth/adapters/jwt.service'
import { errorsHandler } from '../../../core/errors/errors.handler'
import { HttpStatus } from '../../../core/types/http-statuses'
import { securityDevicesService } from '../../../composition-root'

type Params = {
    deviceId: string
}

export const deleteSecurityDeviceByDeviceIdHandler = async (
    req: Request<Params>,
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

        const result =
            await securityDevicesService.deleteSecurityDeviceByDeviceId(
                payload.userId,
                req.params.deviceId
            )

        if (result === 'notFound') {
            return res.sendStatus(HttpStatus.NotFound)
        }

        if (result === 'forbidden') {
            return res.sendStatus(HttpStatus.Forbidden)
        }

        return res.sendStatus(HttpStatus.NoContent)
    } catch (error) {
        errorsHandler(error, res)
    }
}
