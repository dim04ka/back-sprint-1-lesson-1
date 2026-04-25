import { usersCollection } from '../../db/mongo.db'
import { ObjectId, WithId } from 'mongodb'
import { User } from '../domain/user.entity'

export const usersRepository = {
    async create(user: User): Promise<string> {
        const newUser = await usersCollection.insertOne({ ...user })

        return newUser.insertedId.toString()
    },

    async update(user: WithId<User>): Promise<void> {
        await usersCollection.updateOne(
            { _id: user._id },
            { $set: user }
        )
    },

    async doesExistByLoginOrEmail(login: string, email: string) {
        const user = await usersCollection.findOne({
            $or: [{ login: login }, { email: email }],
        })
        return user ? true : false
    },

    async doesExistByEmail(email: string) {
        const user = await usersCollection.findOne({ email: email })
        return user
    },

    async findByLoginOrEmail(loginOrEmail: string) {
        const user = await usersCollection.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
        })

        return user
    },
    async findByConfirmationCode(code: string) {
        const user = await usersCollection.findOne({
            'emailConfirmation.confirmationCode': code,
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
