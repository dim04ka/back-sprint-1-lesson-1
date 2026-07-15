import { SessionModel } from '../../db/mongo.db/schemes'

export class SecurityDevicesRepository {
    constructor() {}
    async getSecurityDevices(userId: string) {
        const securityDevices = await SessionModel.find({
            user_id: userId,
        }).exec()
        return securityDevices
    }

    async deleteOtherSecurityDevices(
        userId: string,
        currentDeviceId: string
    ) {
        await SessionModel.deleteMany({
            user_id: userId,
            device_id: { $ne: currentDeviceId },
        })
    }
    async findSecurityDeviceByDeviceId(deviceId: string) {
        const securityDevice = await SessionModel.findOne({
            device_id: deviceId,
        })
        return securityDevice
    }
    async deleteSecurityDeviceByDeviceId(deviceId: string) {
        await SessionModel.deleteOne({
            device_id: deviceId,
        })
    }
    async deleteSecurityDeviceByDeviceIdAndIat({
        deviceId,
        iat,
    }: {
        deviceId: string
        iat: Date
    }): Promise<boolean> {
        const result = await SessionModel.deleteOne({
            device_id: deviceId,
            iat,
        })

        return result.deletedCount === 1
    }
    async updateSecurityDeviceIat({
        deviceId,
        currentIat,
        newIat,
        exp,
    }: {
        deviceId: string
        currentIat: Date
        newIat: Date
        exp: Date
    }): Promise<boolean> {
        const result = await SessionModel.updateOne(
            {
                device_id: deviceId,
                iat: currentIat,
            },
            {
                $set: {
                    iat: newIat,
                    exp,
                },
            }
        )

        return result.matchedCount === 1
    }
}
