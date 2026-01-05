import request from 'supertest'

import express from 'express'
import { setupApp } from '../../../src/setup-app'
import { db } from '../../../src/db'

describe('Driver API', () => {
    const app = express()
    setupApp(app)

    describe('GET /videos', () => {
        it('should return all videos', async () => {
            const res = await request(app).get('/videos')
            expect(res.status).toBe(200)
            expect(res.body).toEqual(db.videos)
        })
    })
})
