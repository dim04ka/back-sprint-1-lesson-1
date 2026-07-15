import bcrypt from 'bcrypt'

export class BcryptService {
    async generateHash(password: string) {
        const salt = await bcrypt.genSalt(10)

        const hash = await bcrypt.hash(password, salt)

        return hash
    }

    async checkPassword(password: string, hash: string) {
        return bcrypt.compare(password, hash)
    }
}
export const bcryptService = new BcryptService()
