import { securityDevicesRepository } from '../repository/securityDevices.repository'

type DeleteSecurityDeviceResult = 'success' | 'notFound' | 'forbidden'

type UpdateSecurityDeviceIatParams = {
    deviceId: string
    currentIat: Date
    newIat: Date
    exp: Date
}

type DeleteSecurityDeviceByDeviceIdAndIatParams = {
    deviceId: string
    iat: Date
}

type ValidateRefreshSessionParams = {
    userId: string
    deviceId: string
    iat: Date
}

class SecurityDevicesService {
    async getSecurityDevices(userId: string) {
        const securityDevices =
            await securityDevicesRepository.getSecurityDevices(userId)
        return securityDevices
    }
    async deleteOtherSecurityDevices(
        userId: string,
        currentDeviceId: string
    ): Promise<void> {
        await securityDevicesRepository.deleteOtherSecurityDevices(
            userId,
            currentDeviceId
        )
    }
    async deleteSecurityDeviceByDeviceId(
        userId: string,
        deviceId: string
    ): Promise<DeleteSecurityDeviceResult> {
        const securityDevice =
            await securityDevicesRepository.findSecurityDeviceByDeviceId(
                deviceId
            )

        if (!securityDevice) {
            return 'notFound'
        }

        if (securityDevice.user_id !== userId) {
            return 'forbidden'
        }

        await securityDevicesRepository.deleteSecurityDeviceByDeviceId(
            deviceId
        )

        return 'success'
    }

    async updateSecurityDeviceIat(
        params: UpdateSecurityDeviceIatParams
    ): Promise<boolean> {
        return securityDevicesRepository.updateSecurityDeviceIat(params)
    }

    async validateRefreshSession({
        userId,
        deviceId,
        iat,
    }: ValidateRefreshSessionParams): Promise<boolean> {
        const securityDevice =
            await securityDevicesRepository.findSecurityDeviceByDeviceId(
                deviceId
            )

        if (!securityDevice) {
            return false
        }

        return (
            securityDevice.user_id === userId &&
            securityDevice.iat.getTime() === iat.getTime()
        )
    }

    async deleteSecurityDeviceByDeviceIdAndIat(
        params: DeleteSecurityDeviceByDeviceIdAndIatParams
    ): Promise<boolean> {
        return securityDevicesRepository.deleteSecurityDeviceByDeviceIdAndIat(
            params
        )
    }
}

export const securityDevicesService = new SecurityDevicesService()
