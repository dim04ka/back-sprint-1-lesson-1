import { Router } from 'express'
import { getSecurityDevicesHandler } from './handlers/getSecurityDevicesHandler'
import { deleteOtherSecurityDevicesHandler } from './handlers/deleteOtherSecurityDevicesHandler'
import { deleteSecurityDeviceByDeviceIdHandler } from './handlers/deleteSecurityDeviceByDeviceIdHandler'

export const securityDevicesRouter = Router()

securityDevicesRouter.get(
    '/',
    getSecurityDevicesHandler
)

securityDevicesRouter.delete(
    '/',
    deleteOtherSecurityDevicesHandler
)

securityDevicesRouter.delete(
    '/:deviceId',
    deleteSecurityDeviceByDeviceIdHandler
)
