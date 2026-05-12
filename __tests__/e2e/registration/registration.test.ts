import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
// import { usersService } from '../../../src/users/service/users.service'
import { ResultStatus } from '../../../src/common/result/resultCode'
import { UsersRepository } from '../../../src/users/repository/users.repository'
import { NodemailerService } from '../../../src/auth/adapters/nodemailer.service'
import { AuthService } from '../../../src/auth/business-logic/auth-service'
import { JwtService } from '../../../src/auth/adapters/jwt.service'

describe('Registration', () => {
    let mongoServer: MongoMemoryServer

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)
    })

    beforeEach(() => {
        nodemailerServiceMock.sendEmail.mockClear()
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoServer.stop()
    })


    const userRepository = new UsersRepository()
   
    const nodemailerServiceMock: jest.Mocked<NodemailerService> =  {
        sendEmail: jest.fn(),
    }
    const jwtServiceMock: jest.Mocked<JwtService> = {
        createToken: jest.fn(),
        decodeToken: jest.fn(),
        verifyToken: jest.fn(),
    }
    const authService = new AuthService(userRepository, nodemailerServiceMock, jwtServiceMock)




    it('should register a new user', async () => {

        const login = 'test'
        const email = 'test@test.com'
        const password = 'test'


        const result = await authService.createUser(login, email, password)

        expect(result?.status).toBe(ResultStatus.Success)
        expect(result?.data).toBeDefined()
        expect(result?.data?.login).toBe(login)
        expect(result?.data?.email).toBe(email)

        expect(nodemailerServiceMock.sendEmail).toHaveBeenCalledWith(email, expect.any(String), expect.any(Function))
      

    })

    it('should not register a user with an existing login', async () => {
        const login = 'test'
        const email = 'test@test.com'
        const password = 'test'

        const result = await authService.createUser(login, email, password)

        expect(result.status).toBe(ResultStatus.BadRequest)
        expect(result.errorMessage).toBe('login or email already exists')
    })


    it('should not register a user with an existing email', async () => {
        const login = 'test'
        const email = 'test@test.com'
        const password = 'test'

        const result = await authService.createUser(login, email, password)

        expect(result.status).toBe(ResultStatus.BadRequest)
        expect(result.errorMessage).toBe('login or email already exists')
    })

    it('this.nodemailerServiceMock.sendEmail shouldn\'t be called', async () => {
        const login = 'test'
        const email = 'test@test.com'
        const password = 'test'

        await authService.createUser(login, email, password)

        expect(nodemailerServiceMock.sendEmail).not.toHaveBeenCalled()
    })
})