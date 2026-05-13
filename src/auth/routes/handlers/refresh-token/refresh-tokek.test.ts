import express from 'express'
import request from 'supertest'

import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../../../const'
import { HttpStatus } from '../../../../core/types/http-statuses'
import { ROUTES } from '../../../../core/path'
import { runDB, stopDb } from '../../../../db/mongo.db'
import { setupApp } from '../../../../setup-app'

const testUser = {
    login: 'refresh',
    email: 'refresh-user@example.com',
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

describe('Refresh token API', () => {
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

    const loginUser = async () =>
        request(app)
            .post(`${ROUTES.AUTH}/login`)
            .send({
                loginOrEmail: testUser.login,
                password: testUser.password,
            })
            .expect(HttpStatus.Ok)

    it('should refresh access token and return new refresh token cookie', async () => {
        const loginRes = await loginUser()
        const refreshTokenCookie = getRefreshTokenCookie(
            getCookies(loginRes.headers['set-cookie'])
        )

        expect(refreshTokenCookie).toBeDefined()

        const res = await request(app)
            .post(`${ROUTES.AUTH}/refresh-token`)
            .set('Cookie', refreshTokenCookie as string)
            .expect(HttpStatus.Ok)

        const cookies = getCookies(res.headers['set-cookie'])
        const newRefreshTokenCookie = getRefreshTokenCookie(cookies)

        expect(res.body).toEqual({
            accessToken: expect.any(String),
        })
        expect(res.body.accessToken.length).toBeGreaterThan(0)
        expect(newRefreshTokenCookie).toBeDefined()
        expect(newRefreshTokenCookie).toContain('HttpOnly')
        expect(newRefreshTokenCookie).toContain('Secure')
    })

    it('should return 401 on logout when refresh token was invalidated by refresh-token', async () => {
        const loginRes = await loginUser()
        const oldRefreshTokenCookie = getRefreshTokenCookie(
            getCookies(loginRes.headers['set-cookie'])
        )

        expect(oldRefreshTokenCookie).toBeDefined()

        await request(app)
            .post(`${ROUTES.AUTH}/refresh-token`)
            .set('Cookie', oldRefreshTokenCookie as string)
            .expect(HttpStatus.Ok)

        await request(app)
            .post(`${ROUTES.AUTH}/logout`)
            .set('Cookie', oldRefreshTokenCookie as string)
            .expect(HttpStatus.Unauthorized)
    })

    it('should not refresh tokens without refresh token cookie', async () => {
        await request(app)
            .post(`${ROUTES.AUTH}/refresh-token`)
            .expect(HttpStatus.Unauthorized)
    })

    it('should not refresh tokens with invalid refresh token cookie', async () => {
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => undefined)

        try {
            await request(app)
                .post(`${ROUTES.AUTH}/refresh-token`)
                .set('Cookie', 'refreshToken=invalid-token')
                .expect(HttpStatus.Unauthorized)
        } finally {
            consoleErrorSpy.mockRestore()
        }
    })

    it('should not refresh tokens with expired refresh token cookie', async () => {
        const loginRes = await loginUser()
        const refreshTokenCookie = getRefreshTokenCookie(
            getCookies(loginRes.headers['set-cookie'])
        )

        expect(refreshTokenCookie).toBeDefined()

        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => undefined)

        jest.useFakeTimers()

        try {
            jest.setSystemTime(Date.now() + 210000)

            await request(app)
                .post(`${ROUTES.AUTH}/refresh-token`)
                .set('Cookie', refreshTokenCookie as string)
                .expect(HttpStatus.Unauthorized)
        } finally {
            jest.useRealTimers()
            consoleErrorSpy.mockRestore()
        }
    })
})
