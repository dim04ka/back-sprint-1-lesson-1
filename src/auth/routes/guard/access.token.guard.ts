import { NextFunction, Request, Response } from 'express'
import { jwtService } from '../../adapters/jwt.service'
export const accessTokenGuard = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.headers.authorization) return res.sendStatus(401)

    const [authType, token] = req.headers.authorization.split(' ')

    if (authType !== 'Bearer' || !token) return res.sendStatus(401)

    const payload = await jwtService.verifyToken(token)

    if (payload) {
        const { userId } = payload

        req.user = { id: userId }
        next()

        return
    }
    res.sendStatus(401)

    return
}
