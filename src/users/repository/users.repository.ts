import { ObjectId, WithId } from 'mongodb'
import { User } from '../domain/user.entity'
import { UserModel } from '../../db/mongo.db/schemes/users'

export class UsersRepository {
    constructor() {}
    async create(user: User): Promise<string> {
        const newUser = await UserModel.insertOne(user)

        return newUser._id.toString()
    }

    async update(user: WithId<User>): Promise<void> {
        await UserModel.updateOne({ _id: user._id }, { $set: user })
    }

    async doesExistByLoginOrEmail(login: string, email: string) {
        const user = await UserModel.findOne({
            $or: [{ login: login }, { email: email }],
        })
        return user ? true : false
    }

    async doesExistByEmail(email: string) {
        const user = await UserModel.findOne({
            email: email,
        })
        return user
    }

    async findByLoginOrEmail(loginOrEmail: string) {
        const user = await UserModel.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
        })

        return user
    }
    async findByConfirmationCode(code: string) {
        const user = await UserModel.findOne({
            'emailConfirmation.confirmationCode': code,
        })

        return user
    }
    async findById(id: string) {
        const user = await UserModel.findOne({
            _id: new ObjectId(id),
        })

        return user
    }
    async delete(id: string) {
        const result = await UserModel.deleteOne({
            _id: new ObjectId(id),
        })
        if (result.deletedCount === 0) {
            return false
        }
        return true
    }
}
