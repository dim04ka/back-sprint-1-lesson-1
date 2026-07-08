import { securityDevicesRepository } from '../repository/securityDevices.repository'

class SecurityDevicesService {
    async getSecurityDevices(userId: string) {
        const securityDevices =
            await securityDevicesRepository.getSecurityDevices(userId)
        return securityDevices
    }
}

export const securityDevicesService = new SecurityDevicesService()
