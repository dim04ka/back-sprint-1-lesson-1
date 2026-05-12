import express from 'express'
import request from 'supertest'

import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../../src/const'
import { HttpStatus } from '../../../src/core/types/http-statuses'
import { ROUTES } from '../../../src/core/path'
import { runDB, stopDb } from '../../../src/db/mongo.db'
import { setupApp } from '../../../src/setup-app'

const testUser = {
    login: 'login-user',
    email: 'login-user@example.com',
    password: 'qwerty123',
}

describe('Login API', () => {
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

    it('should login user by login and return access token with refresh token cookie', async () => {
        const res = await request(app)
            .post(`${ROUTES.AUTH}/login`)
            .send({
                loginOrEmail: testUser.login,
                password: testUser.password,
            })
            .expect(HttpStatus.Ok)

        const setCookieHeader = res.headers['set-cookie']
        const cookies = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader].filter((cookie): cookie is string =>
                  Boolean(cookie)
              )

        expect(res.body).toEqual({
            accessToken: expect.any(String),
        })
        expect(res.body.accessToken.length).toBeGreaterThan(0)
        expect(
            cookies.some((cookie) => cookie.startsWith('refreshToken='))
        ).toBe(true)
        expect(cookies?.[0]).toContain('HttpOnly')
        expect(cookies?.[0]).toContain('Secure')
    })

    it('should login user by email', async () => {
        const res = await request(app)
            .post(`${ROUTES.AUTH}/login`)
            .send({
                loginOrEmail: testUser.email,
                password: testUser.password,
            })
            .expect(HttpStatus.Ok)

        expect(res.body).toEqual({
            accessToken: expect.any(String),
        })
    })

    it('should not login user with wrong password', async () => {
        await request(app)
            .post(`${ROUTES.AUTH}/login`)
            .send({
                loginOrEmail: testUser.login,
                password: 'wrong-password',
            })
            .expect(HttpStatus.Unauthorized)
    })

    it('should not login unknown user', async () => {
        await request(app)
            .post(`${ROUTES.AUTH}/login`)
            .send({
                loginOrEmail: 'unknown-user',
                password: testUser.password,
            })
            .expect(HttpStatus.Unauthorized)
    })

    it('should return validation errors for invalid body', async () => {
        const res = await request(app)
            .post(`${ROUTES.AUTH}/login`)
            .send({
                loginOrEmail: '',
                password: '123',
            })
            .expect(HttpStatus.BadRequest)

        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ field: 'loginOrEmail' }),
                expect.objectContaining({ field: 'password' }),
            ])
        )
    })
})
