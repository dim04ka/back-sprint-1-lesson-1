import { sessionsCollection } from '../../db/mongo.db'

export const securityDevicesRepository = {
    getSecurityDevices: async (userId: string) => {
        const securityDevices = await sessionsCollection
            .find({ user_id: userId })
            .toArray()
        return securityDevices
    },
    deleteOtherSecurityDevices: async (
        userId: string,
        currentDeviceId: string
    ) => {
        await sessionsCollection.deleteMany({
            user_id: userId,
            device_id: { $ne: currentDeviceId },
        })
    },
    findSecurityDeviceByDeviceId: async (deviceId: string) => {
        const securityDevice = await sessionsCollection.findOne({
            device_id: deviceId,
        })
        return securityDevice
    },
    deleteSecurityDeviceByDeviceId: async (deviceId: string) => {
        await sessionsCollection.deleteOne({
            device_id: deviceId,
        })
    },
    deleteSecurityDeviceByDeviceIdAndIat: async ({
        deviceId,
        iat,
    }: {
        deviceId: string
        iat: Date
    }): Promise<boolean> => {
        const result = await sessionsCollection.deleteOne({
            device_id: deviceId,
            iat,
        })

        return result.deletedCount === 1
    },
    updateSecurityDeviceIat: async ({
        deviceId,
        currentIat,
        newIat,
        exp,
    }: {
        deviceId: string
        currentIat: Date
        newIat: Date
        exp: Date
    }): Promise<boolean> => {
        const result = await sessionsCollection.updateOne(
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
    },
}
