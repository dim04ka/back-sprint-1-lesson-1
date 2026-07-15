import express from 'express'
import request from 'supertest'

import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../../src/const'
import { HttpStatus } from '../../../src/core/types/http-statuses'
import { ROUTES } from '../../../src/core/path'
import { runDB, stopDb } from '../../../src/db/mongo.db'
import {
    RaceLimitedRequestsModel,
    SessionModel,
} from '../../../src/db/mongo.db/schemes'
import { setupApp } from '../../../src/setup-app'

const testUser = {
    login: 'login-user',
    email: 'login-user@example.com',
    password: 'qwerty123',
}

type SecurityDeviceViewModel = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
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

describe('Login API', () => {
    const app = express()
    setupApp(app)

    beforeAll(async () => {
        await runDB()

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
            cookies.some((cookie) =>
                cookie.startsWith('refreshToken=')
            )
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

    it('should keep current session after deleting all other sessions', async () => {
        await RaceLimitedRequestsModel.deleteMany({})
        await SessionModel.deleteMany({})

        const sessionTestUser = {
            login: 'sess-user',
            email: 'session-user@example.com',
            password: 'qwerty123',
        }

        await request(app)
            .post(ROUTES.USERS)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .send(sessionTestUser)
            .expect(HttpStatus.Created)

        const userAgents = [
            'Mozilla/5.0 Chrome',
            'Mozilla/5.0 Firefox',
            'Mozilla/5.0 Safari',
            'Mozilla/5.0 Edge',
        ]
        let refreshTokenCookie = ''

        for (const userAgent of userAgents) {
            const res = await request(app)
                .post(`${ROUTES.AUTH}/login`)
                .set('User-Agent', userAgent)
                .send({
                    loginOrEmail: sessionTestUser.login,
                    password: sessionTestUser.password,
                })
                .expect(HttpStatus.Ok)

            const setCookieHeader = res.headers['set-cookie']
            const cookies = Array.isArray(setCookieHeader)
                ? setCookieHeader
                : [setCookieHeader].filter(
                      (cookie): cookie is string => Boolean(cookie)
                  )

            expect(res.body).toEqual({
                accessToken: expect.any(String),
            })
            expect(res.body.accessToken.length).toBeGreaterThan(0)
            expect(
                cookies.some((cookie) =>
                    cookie.startsWith('refreshToken=')
                )
            ).toBe(true)
            refreshTokenCookie =
                cookies.find((cookie) =>
                    cookie.startsWith('refreshToken=')
                ) || refreshTokenCookie
        }

        const securityDevicesResponse = await request(app)
            .get(ROUTES.SECURITY_DEVICES)
            .set('Cookie', refreshTokenCookie)
            .expect(HttpStatus.Ok)

        expect(securityDevicesResponse.body).toHaveLength(
            userAgents.length
        )
        expect(securityDevicesResponse.body).toEqual(
            expect.arrayContaining(
                userAgents.map((userAgent) =>
                    expect.objectContaining({
                        ip: expect.any(String),
                        title: userAgent,
                        lastActiveDate: expect.any(String),
                        deviceId: expect.any(String),
                    })
                )
            )
        )

        await request(app)
            .delete(ROUTES.SECURITY_DEVICES)
            .set('Cookie', refreshTokenCookie)
            .expect(HttpStatus.NoContent)

        const currentSecurityDeviceResponse = await request(app)
            .get(ROUTES.SECURITY_DEVICES)
            .set('Cookie', refreshTokenCookie)
            .expect(HttpStatus.Ok)

        expect(currentSecurityDeviceResponse.body).toHaveLength(1)
        expect(currentSecurityDeviceResponse.body[0]).toEqual(
            expect.objectContaining({
                title: userAgents[userAgents.length - 1],
            })
        )
    })

    it('should manage security devices lifecycle with refresh token', async () => {
        await SessionModel.deleteMany({})

        const devicesTestUser = {
            login: 'devices01',
            email: 'devices-user@example.com',
            password: 'qwerty123',
        }
        const forbiddenTestUser = {
            login: 'forbid01',
            email: 'forbidden-device-user@example.com',
            password: 'qwerty123',
        }
        const userAgents = [
            'Devices Test Chrome',
            'Devices Test Firefox',
            'Devices Test Safari',
            'Devices Test Edge',
        ]

        await request(app)
            .post(ROUTES.USERS)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .send(devicesTestUser)
            .expect(HttpStatus.Created)

        await request(app)
            .post(ROUTES.USERS)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .send(forbiddenTestUser)
            .expect(HttpStatus.Created)

        const loginUser = async (
            loginOrEmail: string,
            password: string,
            userAgent: string
        ): Promise<string> => {
            const res = await request(app)
                .post(`${ROUTES.AUTH}/login`)
                .set('User-Agent', userAgent)
                .send({
                    loginOrEmail,
                    password,
                })
                .expect(HttpStatus.Ok)

            const refreshTokenCookie = getRefreshTokenCookie(
                getCookies(res.headers['set-cookie'])
            )

            expect(refreshTokenCookie).toBeDefined()

            return refreshTokenCookie as string
        }

        const refreshTokenCookies = []
        for (const userAgent of userAgents) {
            const refreshTokenCookie = await loginUser(
                devicesTestUser.login,
                devicesTestUser.password,
                userAgent
            )

            refreshTokenCookies.push(refreshTokenCookie)
        }

        const securityDevicesResponse = await request(app)
            .get(ROUTES.SECURITY_DEVICES)
            .set('Cookie', refreshTokenCookies[0])
            .expect(HttpStatus.Ok)

        const securityDevices =
            securityDevicesResponse.body as SecurityDeviceViewModel[]

        expect(securityDevices).toHaveLength(userAgents.length)

        const getDeviceByTitle = (title: string) => {
            const device = securityDevices.find(
                (securityDevice) => securityDevice.title === title
            )

            expect(device).toBeDefined()

            return device as SecurityDeviceViewModel
        }

        const firstDevice = getDeviceByTitle(userAgents[0])
        const secondDevice = getDeviceByTitle(userAgents[1])
        const thirdDevice = getDeviceByTitle(userAgents[2])
        const originalDeviceIds = securityDevices.map(
            (securityDevice) => securityDevice.deviceId
        )
        const originalFirstDeviceLastActiveDate =
            firstDevice.lastActiveDate

        await request(app)
            .get(ROUTES.SECURITY_DEVICES)
            .expect(HttpStatus.Unauthorized)

        await request(app)
            .delete(`${ROUTES.SECURITY_DEVICES}/unknown-device-id`)
            .set('Cookie', refreshTokenCookies[0])
            .expect(HttpStatus.NotFound)

        const forbiddenRefreshTokenCookie = await loginUser(
            forbiddenTestUser.login,
            forbiddenTestUser.password,
            'Forbidden Device Test'
        )

        await request(app)
            .delete(
                `${ROUTES.SECURITY_DEVICES}/${firstDevice.deviceId}`
            )
            .set('Cookie', forbiddenRefreshTokenCookie)
            .expect(HttpStatus.Forbidden)

        const refreshTokenResponse = await request(app)
            .post(`${ROUTES.AUTH}/refresh-token`)
            .set('Cookie', refreshTokenCookies[0])
            .expect(HttpStatus.Ok)
        const updatedFirstDeviceRefreshTokenCookie =
            getRefreshTokenCookie(
                getCookies(refreshTokenResponse.headers['set-cookie'])
            )

        expect(updatedFirstDeviceRefreshTokenCookie).toBeDefined()

        const refreshedSecurityDevicesResponse = await request(app)
            .get(ROUTES.SECURITY_DEVICES)
            .set(
                'Cookie',
                updatedFirstDeviceRefreshTokenCookie as string
            )
            .expect(HttpStatus.Ok)
        const refreshedSecurityDevices =
            refreshedSecurityDevicesResponse.body as SecurityDeviceViewModel[]
        const refreshedFirstDevice = refreshedSecurityDevices.find(
            (securityDevice) =>
                securityDevice.deviceId === firstDevice.deviceId
        )

        expect(refreshedSecurityDevices).toHaveLength(
            userAgents.length
        )
        expect(
            refreshedSecurityDevices.map(
                (securityDevice) => securityDevice.deviceId
            )
        ).toEqual(expect.arrayContaining(originalDeviceIds))
        expect(refreshedFirstDevice).toBeDefined()
        expect(refreshedFirstDevice?.lastActiveDate).not.toBe(
            originalFirstDeviceLastActiveDate
        )

        await request(app)
            .delete(
                `${ROUTES.SECURITY_DEVICES}/${secondDevice.deviceId}`
            )
            .set(
                'Cookie',
                updatedFirstDeviceRefreshTokenCookie as string
            )
            .expect(HttpStatus.NoContent)

        const securityDevicesWithoutSecondDeviceResponse =
            await request(app)
                .get(ROUTES.SECURITY_DEVICES)
                .set(
                    'Cookie',
                    updatedFirstDeviceRefreshTokenCookie as string
                )
                .expect(HttpStatus.Ok)
        const securityDevicesWithoutSecondDevice =
            securityDevicesWithoutSecondDeviceResponse.body as SecurityDeviceViewModel[]

        expect(securityDevicesWithoutSecondDevice).toHaveLength(
            userAgents.length - 1
        )
        expect(
            securityDevicesWithoutSecondDevice.some(
                (securityDevice) =>
                    securityDevice.deviceId === secondDevice.deviceId
            )
        ).toBe(false)

        await request(app)
            .post(`${ROUTES.AUTH}/logout`)
            .set('Cookie', refreshTokenCookies[2])
            .expect(HttpStatus.NoContent)

        const securityDevicesWithoutThirdDeviceResponse =
            await request(app)
                .get(ROUTES.SECURITY_DEVICES)
                .set(
                    'Cookie',
                    updatedFirstDeviceRefreshTokenCookie as string
                )
                .expect(HttpStatus.Ok)
        const securityDevicesWithoutThirdDevice =
            securityDevicesWithoutThirdDeviceResponse.body as SecurityDeviceViewModel[]

        expect(securityDevicesWithoutThirdDevice).toHaveLength(
            userAgents.length - 2
        )
        expect(
            securityDevicesWithoutThirdDevice.some(
                (securityDevice) =>
                    securityDevice.deviceId === thirdDevice.deviceId
            )
        ).toBe(false)

        await request(app)
            .delete(ROUTES.SECURITY_DEVICES)
            .set(
                'Cookie',
                updatedFirstDeviceRefreshTokenCookie as string
            )
            .expect(HttpStatus.NoContent)

        const currentSecurityDeviceResponse = await request(app)
            .get(ROUTES.SECURITY_DEVICES)
            .set(
                'Cookie',
                updatedFirstDeviceRefreshTokenCookie as string
            )
            .expect(HttpStatus.Ok)
        const currentSecurityDevice =
            currentSecurityDeviceResponse.body as SecurityDeviceViewModel[]

        expect(currentSecurityDevice).toHaveLength(1)
        expect(currentSecurityDevice[0]).toEqual(
            expect.objectContaining({
                deviceId: firstDevice.deviceId,
                title: userAgents[0],
            })
        )
    }, 20000)
})
