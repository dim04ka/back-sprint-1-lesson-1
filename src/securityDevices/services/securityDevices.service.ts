import { SecurityDevicesRepository } from '../repository/securityDevices.repository'

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

export class SecurityDevicesService {
    constructor(
        private readonly securityDevicesRepository: SecurityDevicesRepository
    ) {}
    async getSecurityDevices(userId: string) {
        const securityDevices =
            await this.securityDevicesRepository.getSecurityDevices(
                userId
            )
        return securityDevices
    }
    async deleteOtherSecurityDevices(
        userId: string,
        currentDeviceId: string
    ): Promise<void> {
        await this.securityDevicesRepository.deleteOtherSecurityDevices(
            userId,
            currentDeviceId
        )
    }
    async deleteSecurityDeviceByDeviceId(
        userId: string,
        deviceId: string
    ): Promise<DeleteSecurityDeviceResult> {
        const securityDevice =
            await this.securityDevicesRepository.findSecurityDeviceByDeviceId(
                deviceId
            )

        if (!securityDevice) {
            return 'notFound'
        }

        if (securityDevice.user_id !== userId) {
            return 'forbidden'
        }

        await this.securityDevicesRepository.deleteSecurityDeviceByDeviceId(
            deviceId
        )

        return 'success'
    }

    async updateSecurityDeviceIat(
        params: UpdateSecurityDeviceIatParams
    ): Promise<boolean> {
        return this.securityDevicesRepository.updateSecurityDeviceIat(
            params
        )
    }

    async validateRefreshSession({
        userId,
        deviceId,
        iat,
    }: ValidateRefreshSessionParams): Promise<boolean> {
        const securityDevice =
            await this.securityDevicesRepository.findSecurityDeviceByDeviceId(
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
        return this.securityDevicesRepository.deleteSecurityDeviceByDeviceIdAndIat(
            params
        )
    }
}
