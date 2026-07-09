import { bcryptService } from '../../auth/adapters/bcrypt.service'
import { DomainError } from '../../core/errors/domain.error'
import { usersRepository } from '../repository/users.repository'
import { CreateUserDto } from '../types/create-user.dto'
import { IUserDB } from '../types/user.db.interface'
import { User } from '../domain/user.entity'
import { nodemailerService } from '../../auth/adapters/nodemailer.service'
import { emailExamples } from '../../auth/adapters/emailExamples'
import { Result } from '../../common/result/result.type'
import { ResultStatus } from '../../common/result/resultCode'

export const usersService = {
    async registerUser(dto: {
        email: string
        login: string
        password: string
    }): Promise<Result<User | null>> {
        const { email, login, password } = dto

        const isExistByLoginOrEmail = await usersRepository.doesExistByLoginOrEmail(
            login,
            email
        )
        if (isExistByLoginOrEmail) {
            const isExistByEmail = await usersRepository.doesExistByEmail(
           
                email
            )
            if (isExistByEmail) {
                return {
                    status: ResultStatus.BadRequest,
                    data: null,
                    extensions: [
                        {
                            field: 'email',
                            message: 'email already exists',
                        },
                    ],
                }

            }
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [
                    {
                        field: 'login',
                        message: 'login already exists',
                    },
                ],
            }
        }

        const passwordHash =
            await bcryptService.generateHash(password)

        const newUser = new User(login, email, passwordHash)



        await usersRepository.create(newUser)

        try {
            await nodemailerService.sendEmail(
                email,
                newUser.emailConfirmation.confirmationCode,
                emailExamples.registrationEmail
            )
        } catch (e: unknown) {
            console.error('Send email error', e)
        }

        return {
            status: ResultStatus.Success,
            data: newUser,
            extensions: [],
        }
    },
    async create(dto: CreateUserDto) {
        const { email, login, password } = dto

        const loginTaken =
            await usersRepository.findByLoginOrEmail(login)
        if (loginTaken) {
            throw new DomainError(
                'login already exist',
                'LOGIN_ALREADY_EXISTS',
                'login'
            )
        }

        const emailTaken =
            await usersRepository.findByLoginOrEmail(email)
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

        const newUserId = await usersRepository.create(newUser)

        return newUserId
    },

    async delete(id: string) {
        const user = await usersRepository.findById(id)
        if (!user) {
            return false
        }
        return await usersRepository.delete(id)
    },
}
