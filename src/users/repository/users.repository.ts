import { usersCollection } from '../../db/mongo.db'
import { ObjectId } from 'mongodb'
import { User } from '../domain/user.entity'

export const usersRepository = {
    async create(user: User): Promise<string> {
        const newUser = await usersCollection.insertOne({ ...user })

        return newUser.insertedId.toString()
    },

    async findByLoginOrEmail(loginOrEmail: string) {
        const user = await usersCollection.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
        })

        return user
    },
    async findById(id: string) {
        const user = await usersCollection.findOne({
            _id: new ObjectId(id),
        })

        return user
    },
    async delete(id: string) {
        const result = await usersCollection.deleteOne({
            _id: new ObjectId(id),
        })
        if (result.deletedCount === 0) {
            return false
        }
        return true
    },
}
