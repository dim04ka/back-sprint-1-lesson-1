import { NextFunction, Request, Response } from 'express'
import { HttpStatus } from '../types/http-statuses'
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../../const'

export const superAdminGuardMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const auth = req.headers['authorization']
    console.log('auth', auth)
    if (!auth) {
        res.sendStatus(HttpStatus.Unauthorized)
        return
    }
    const [type, token] = auth.split(' ')
    if (type !== 'Basic') {
        res.sendStatus(HttpStatus.Unauthorized)
        return
    }

    const credentials = Buffer.from(token, 'base64').toString('utf-8')
    const [username, password] = credentials.split(':')

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        res.sendStatus(HttpStatus.Unauthorized)
        return
    }
    next()
}
