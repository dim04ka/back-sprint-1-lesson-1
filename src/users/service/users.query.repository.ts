import { SortQueryFilterType } from '../../core/types/sortQueryFilter.type'
import { UsersQueryRepository } from '../repository/user.query.repository'

export class UsersQueryService {
    constructor(
        private readonly usersQueryRepository: UsersQueryRepository
    ) {}

    findAllUsers(
        dto: SortQueryFilterType & {
            searchLoginTerm?: string
            searchEmailTerm?: string
        }
    ) {
        return this.usersQueryRepository.findAllUsers(dto)
    }
    findById(id: string) {
        return this.usersQueryRepository.findById(id)
    }
}
