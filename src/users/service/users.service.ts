import { bcryptService } from '../../auth/adapters/bcrypt.service'
import { usersRepository } from '../repository/users.repository'
import { CreateUserDto } from '../types/create-user.dto'
import { IUserDB } from '../types/user.db.interface'

export const usersService = {
    async create(dto: CreateUserDto) {
        const { email, login, password } = dto
        const passwordHash =
            await bcryptService.generateHash(password)

        const newUser: IUserDB = {
            email,
            login,
            password: passwordHash,
            createdAt: new Date(),
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
