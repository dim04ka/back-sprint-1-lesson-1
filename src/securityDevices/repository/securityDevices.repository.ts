import { sessionsCollection } from '../../db/mongo.db'

export const securityDevicesRepository = {
    getSecurityDevices: async (userId: string) => {
        const securityDevices = await sessionsCollection
            .find({ user_id: userId })
            .toArray()
        return securityDevices
    },
}
