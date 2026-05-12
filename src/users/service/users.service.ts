import { bcryptService } from '../../auth/adapters/bcrypt.service'
import { DomainError } from '../../core/errors/domain.error'

import { CreateUserDto } from '../types/create-user.dto'
import { IUserDB } from '../types/user.db.interface'
import { User } from '../domain/user.entity'
// import { nodemailerService } from '../../auth/adapters/nodemailer.service'
import { emailExamples } from '../../auth/adapters/emailExamples'
import { Result } from '../../common/result/result.type'
import { ResultStatus } from '../../common/result/resultCode'
import { UsersRepository } from '../repository/users.repository'
import { WithId } from 'mongodb'



export class UsersService {
    constructor(protected usersRepository: UsersRepository) {}


    async create(dto: CreateUserDto): Promise<WithId<IUserDB>> {
        const { email, login, password } = dto

        const loginTaken =
            await this.usersRepository.findByLoginOrEmail(login)
        if (loginTaken) {
            throw new DomainError(
                'login already exist',
                'LOGIN_ALREADY_EXISTS',
                'login'
            )
        }

        const emailTaken =
            await this.usersRepository.findByLoginOrEmail(email)
        if (emailTaken) {
            throw new DomainError(
                'email already exist',
                'EMAIL_ALREADY_EXISTS',
                'email'
            )
        }

        const passwordHash =
            await bcryptService.generateHash(password)

        const newUser: IUserDB = {
            email,
            login,
            password: passwordHash,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: '',
                expirationDate: new Date(),
                isConfirmed: true,
            },
        }

        const newUserId = await this.usersRepository.create(newUser)

        return newUserId
    }

    async delete(id: string) {
        const user = await this.usersRepository.findById(id)
        if (!user) {
            return false
        }
        return await this.usersRepository.delete(id)
    }
}
