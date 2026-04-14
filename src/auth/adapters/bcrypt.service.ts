import bcrypt from 'bcrypt'

export const bcryptService = {
    async generateHash(password: string) {
        const salt = await bcrypt.genSalt(10)
        console.log('salt', salt)
        const hash = await bcrypt.hash(password, salt)
        console.log('hash', hash)
        return hash
    },

    async checkPassword(password: string, hash: string) {
        return bcrypt.compare(password, hash)
    },
}
