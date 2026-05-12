import { ResultStatus } from "../../common/result/resultCode"
import { User } from "../../users/domain/user.entity"
import { UsersRepository } from "../../users/repository/users.repository"
import bcrypt from 'bcrypt'
import { emailExamples } from "../adapters/emailExamples"
import { NodemailerService } from "../adapters/nodemailer.service"
import { JwtService } from "../adapters/jwt.service"
import { Result } from "../../common/result/result.type"
import { WithId } from "mongodb"
import { IUserDB } from "../../users/types/user.db.interface"
import { add } from "date-fns"
import { randomUUID } from "crypto"

export class AuthService {
    
    constructor(protected usersRepository: UsersRepository, protected nodemailerService: NodemailerService, protected jwtService: JwtService) {}


    async createUser(login: string, email: string, password: string) {
        const user = await this.usersRepository.doesExistByLoginOrEmail(
            login,
            email
        )

        if (user) {
            const emailUser = await this.usersRepository.doesExistByEmail(email)
            if (emailUser) {
                return {
                    status: ResultStatus.BadRequest,
                    data: null,
                    errorMessage: 'email already exists',
                    extensions: [ { field: 'email', message: 'email already exists' } ],
                }
            } else {
                return {
                    status: ResultStatus.BadRequest,
                    data: null,
                    errorMessage: 'login already exists',
                    extensions: [ { field: 'login', message: 'login already exists' } ],
                }
            }
        }

        const passwordHash = await this.generateHash(password)
        const newUser = new User(login, email, passwordHash)

        const createdUser = await this.usersRepository.create(newUser)

        await this.nodemailerService.sendEmail(
                    email,
                    newUser.emailConfirmation.confirmationCode,
                    emailExamples.registrationEmail
                )



        return {
            status: ResultStatus.Success,
            data: createdUser,
            extensions: [],

        }
    }

    async login({loginOrEmail, password}: {loginOrEmail: string, password: string}): Promise<Result<{accessToken: string} | null>> {
   
     
        const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'user not found',
                extensions: [{ field: 'loginOrEmail', message: 'user not found' }],
            }
        }
        const isPasswordCorrect = await this.checkPassword(password, user.password)
        if (!isPasswordCorrect) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'password is incorrect',
                extensions: [{ field: 'password', message: 'password is incorrect' }],
            }
        }
 
     
        const accessToken = await this.jwtService.createToken(user._id.toString())
        return {
            status: ResultStatus.Success,
            data: { accessToken },
            extensions: [],
        }
    }

    async generateHash(password: string) {
        const salt = await bcrypt.genSalt(10)

        const hash = await bcrypt.hash(password, salt)

        return hash
    }

    async checkPassword(password: string, hash: string) {
        return bcrypt.compare(password, hash)
    }

    async confirmEmail(code: string): Promise<Result<WithId<IUserDB> | null>> {
        const user = await this.usersRepository.findByConfirmationCode(code)
        if (!user || user.emailConfirmation.isConfirmed || user.emailConfirmation.expirationDate < new Date()) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'code not found or expired',
                extensions: [{ field: 'code', message: 'code not found or expired' }],
            }
        }
        user.emailConfirmation.isConfirmed = true
        await this.usersRepository.update(user)
        return {
            status: ResultStatus.Success,
            data: user,
            extensions: [],
        }
    }

    async resendEmail(email: string) {
        const user = await this.usersRepository.doesExistByEmail(email)
        if (!user || user.emailConfirmation.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'email not found or not confirmed',
                extensions: [{ field: 'email', message: 'email not found or not confirmed' }],
            }
        }

        const newConfirmationCode = randomUUID()
        const newExpirationDate = add(new Date(), { minutes: 30 })
        user.emailConfirmation.confirmationCode = newConfirmationCode
        user.emailConfirmation.expirationDate = newExpirationDate
        await this.update(user)

        try {
            await this.nodemailerService.sendEmail(
                email,
                user.emailConfirmation.confirmationCode,
                emailExamples.registrationEmail
            )
        } catch (e: unknown) {
            console.error('Send email error', e)
        }

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        }

    


    }

    async update(user: WithId<IUserDB>) {
        await this.usersRepository.update(user)
    }
}