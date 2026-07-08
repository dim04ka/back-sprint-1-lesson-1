import { Router } from 'express'
import { getSecurityDevicesHandler } from './handlers/getSecurityDevicesHandler'

export const securityDevicesRouter = Router()

securityDevicesRouter.get(
    '/',
    getSecurityDevicesHandler
)
