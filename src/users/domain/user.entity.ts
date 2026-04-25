import { randomUUID } from 'crypto'

export class User {
    login: string
    email: string
    password: string
    createdAt: Date
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }

    constructor(login: string, email: string, password: string) {
        this.login = login
        this.email = email
        this.password = password
        this.createdAt = new Date()
        this.emailConfirmation = {
            confirmationCode: randomUUID(),
            expirationDate: new Date(),
            isConfirmed: false,
        }
    }
}
