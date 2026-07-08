import { Request, Response } from 'express'
import { LoginDto } from '../../../types/login.dto'
import { authService } from '../../../service/auth.service'
import { HttpStatus } from '../../../../core/types/http-statuses'
import { errorsHandler } from '../../../../core/errors/errors.handler'
import { sessionsCollection } from '../../../../db/mongo.db'
import { jwtService } from '../../../adapters/jwt.service'
import { randomUUID } from 'crypto'

// import { appConfig } from '../../../common/config/config'

export const loginHandler = async (
    req: Request<{}, {}, LoginDto>,
    res: Response
) => {
    try {
        const { loginOrEmail, password } = req.body
        const userAgent = req.headers['user-agent'] || ''
        const ip = req.ip || ''
        const deviceId = randomUUID()

        const result = await authService.login({
            loginOrEmail,
            password,
            deviceId,
        })

        if (!result) {
            return res.sendStatus(HttpStatus.Unauthorized)
        }

        const { accessToken, refreshToken, user_id } = result

        if (!result?.accessToken) {
            return res.sendStatus(HttpStatus.BadRequest)
        }

        const decodedRefreshToken =
            await jwtService.decodeToken(refreshToken)
        if (
            !decodedRefreshToken ||
            typeof decodedRefreshToken.iat !== 'number' ||
            typeof decodedRefreshToken.exp !== 'number'
        ) {
            return res.sendStatus(HttpStatus.Unauthorized)
        }
        const { iat, exp } = decodedRefreshToken

        await sessionsCollection.insertOne({
            user_id,
            device_id: deviceId,
            iat: new Date(iat * 1000),
            device_name: userAgent,
            ip: ip,
            exp: new Date(exp * 1000),
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
        })
        console.log('accessToken=', accessToken)
        return res.send({ accessToken })
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}
