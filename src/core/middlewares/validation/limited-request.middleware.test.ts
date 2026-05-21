import express from 'express'
import request from 'supertest'

import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../../const'
import { HttpStatus } from '../../types/http-statuses'
import { ROUTES } from '../../path'
import { runDB, stopDb } from '../../../db/mongo.db'
import { setupApp } from '../../../setup-app'

const testUser = {
    login: 'ratelimit',
    email: 'ratelimit@example.com',
    password: 'qwerty123',
}

describe('Login rate limit', () => {
    const app = express()
    setupApp(app)

    beforeAll(async () => {
        await runDB(process.env.MONGO_CONNECT_URL || '')

        await request(app)
            .delete(`${ROUTES.TESTING}/all-data`)
            .expect(HttpStatus.NoContent)

        await request(app)
            .post(ROUTES.USERS)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .send(testUser)
            .expect(HttpStatus.Created)
    })

    afterAll(async () => {
        await stopDb()
    })

    const loginRequest = () =>
        request(app).post(`${ROUTES.AUTH}/login`).send({
            loginOrEmail: testUser.login,
            password: testUser.password,
        })

    it('should return 429 when more than 5 login requests from same IP within 10 seconds', async () => {
        for (let i = 0; i < 5; i++) {
            const res = await loginRequest()
            expect(res.status).not.toBe(HttpStatus.TooManyRequests)
        }

        const res = await loginRequest()
        expect(res.status).toBe(HttpStatus.TooManyRequests)
    })
})
