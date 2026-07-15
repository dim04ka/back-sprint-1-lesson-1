import { NextFunction } from 'express'
import { Request, Response } from 'express'
import { RaceLimitedRequestsModel } from '../../../db/mongo.db/schemes'
import { errorsHandler } from '../../errors/errors.handler'
import { HttpStatus } from '../../types/http-statuses'

export const limitedRequestMiddleware =
    ({
        maxRequests = 5,
        timeWindow = 10000,
    }: {
        maxRequests?: number
        timeWindow?: number
    }) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { ip, originalUrl } = req

            if (!ip || !originalUrl) {
                return res.sendStatus(HttpStatus.BadRequest)
            }

            await RaceLimitedRequestsModel.insertOne({
                IP: ip,
                URL: originalUrl,
                date: new Date(),
            })

            const sessionCount =
                await RaceLimitedRequestsModel.countDocuments({
                    IP: ip,
                    URL: originalUrl,
                    date: { $gte: new Date(Date.now() - timeWindow) },
                })

            if (sessionCount > maxRequests) {
                return res.sendStatus(HttpStatus.TooManyRequests)
            }
        } catch (error) {
            errorsHandler(error, res)
        }

        next()
    }
