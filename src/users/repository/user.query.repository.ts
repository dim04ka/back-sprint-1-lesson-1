import { IUserView } from '../types/user.view.interface'
import { ObjectId, WithId } from 'mongodb'
import { IUserDB } from '../types/user.db.interface'
import { SortQueryFilterType } from '../../core/types/sortQueryFilter.type'
import { UserModel } from '../../db/mongo.db/schemes/users'
import { IPagination } from '../../core/types/pagination'

export class UsersQueryRepository {
    constructor() {}
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

        const totalCount = await UserModel.countDocuments(filter)

        const users = await UserModel.find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: users.map((u) =>
                this._getInView(u as unknown as WithId<IUserDB>)
            ),
        }
    }
    async findById(id: string): Promise<IUserView | null> {
        const user = (await UserModel.findOne({
            _id: new ObjectId(id),
        }).lean()) as WithId<IUserDB> | null
        return user ? this._getInView(user) : null
    }
    _getInView(user: WithId<IUserDB>): IUserView {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
        }
    }
}
