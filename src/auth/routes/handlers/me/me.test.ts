import express from 'express'
import request from 'supertest'

import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../../../const'
import { HttpStatus } from '../../../../core/types/http-statuses'
import { ROUTES } from '../../../../core/path'
import { runDB, stopDb } from '../../../../db/mongo.db'
import { setupApp } from '../../../../setup-app'

const testUser = {
    login: 'meuser',
    email: 'me-user@example.com',
    password: 'qwerty123',
}

const getCookies = (
    setCookieHeader: string | string[] | undefined
): string[] => {
    if (Array.isArray(setCookieHeader)) {
        return setCookieHeader
    }

    return setCookieHeader ? [setCookieHeader] : []
}

const getRefreshTokenCookie = (
    cookies: string[]
): string | undefined =>
    cookies.find((cookie) => cookie.startsWith('refreshToken='))

/** Ответ /auth/me совпадает с IUserView (id, login, email, createdAt), не userId. */
const currentUserViewMatcher = {
    id: expect.any(String),
    login: expect.any(String),
    email: expect.any(String),
    createdAt: expect.any(String),
}

describe('GET /auth/me (access token после refresh)', () => {
    jest.setTimeout(30_000)

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

    it('Homework 8 RefreshToken: новый access открывает /auth/me — 200 и данные пользователя', async () => {
        const loginRes = await request(app)
            .post(`${ROUTES.AUTH}/login`)
            .send({
                loginOrEmail: testUser.login,
                password: testUser.password,
            })
            .expect(HttpStatus.Ok)

        const refreshTokenCookie = getRefreshTokenCookie(
            getCookies(loginRes.headers['set-cookie'])
        )

        expect(refreshTokenCookie).toBeDefined()

        const refreshRes = await request(app)
            .post(`${ROUTES.AUTH}/refresh-token`)
            .set('Cookie', refreshTokenCookie as string)
            .expect(HttpStatus.Ok)

        const { accessToken } = refreshRes.body as {
            accessToken: string
        }
        expect(accessToken).toEqual(expect.any(String))

        const meRes = await request(app)
            .get(`${ROUTES.AUTH}/me`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpStatus.Ok)
        expect(meRes.body).toEqual({
            login: testUser.login,
            email: testUser.email,
            userId: expect.any(String),
        })
    })
})
