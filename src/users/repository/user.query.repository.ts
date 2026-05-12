import { IUserView } from '../types/user.view.interface'
import { ObjectId, WithId } from 'mongodb'
import { IUserDB } from '../types/user.db.interface'
import { SortQueryFilterType } from '../../core/types/sortQueryFilter.type'
import { usersCollection } from '../../db/mongo.db'
import { IPagination } from '../../core/types/pagination'

export const usersQwRepository = {
    async findAllUsers(
        sortQueryDto: SortQueryFilterType & {
            searchLoginTerm?: string
            searchEmailTerm?: string
        }
    ): Promise<IPagination<IUserView[]>> {
        const {
            sortBy,
            sortDirection,
            pageSize,
            pageNumber,
            searchLoginTerm,
            searchEmailTerm,
        } = sortQueryDto

        const filter: Record<string, unknown> = {}
        const hasLoginTerm = Boolean(searchLoginTerm)
        const hasEmailTerm = Boolean(searchEmailTerm)

        if (hasLoginTerm && hasEmailTerm) {
            filter.$or = [
                {
                    login: {
                        $regex: searchLoginTerm,
                        $options: 'i',
                    },
                },
                {
                    email: {
                        $regex: searchEmailTerm,
                        $options: 'i',
                    },
                },
            ]
        } else if (hasLoginTerm) {
            filter.login = {
                $regex: searchLoginTerm,
                $options: 'i',
            }
        } else if (hasEmailTerm) {
            filter.email = {
                $regex: searchEmailTerm,
                $options: 'i',
            }
        }

        const totalCount =
            await usersCollection.countDocuments(filter)

            

        const users = await usersCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()
            .exec()

            console.log('users=>', users)

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: users.map((u: WithId<IUserDB>) => this._getInView(u)),
        }
    },
    async findById(id: string): Promise<IUserView | null> {
        const user = await usersCollection.findOne({
            _id: new ObjectId(id),
        })
        return user ? this._getInView(user) : null
    },
    _getInView(user: WithId<IUserDB>): IUserView {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
        }
    },
    _checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    },
}
