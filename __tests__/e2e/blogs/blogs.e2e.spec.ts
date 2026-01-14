import request from 'supertest'

import express from 'express'
import { setupApp } from '../../../src/setup-app'
import { db } from '../../../src/db'
import { Resolution } from '../../../src/videos/dto'
import { HttpStatus } from '../../../src/core/types/http-statuses'
import { API_VERSION, ROUTES } from '../../../src/core/path'
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../../../src/const'

describe('Blogs API', () => {
    const app = express()
    setupApp(app)

    // GET /blogs
    it('should return all blogs', async () => {
        const res = await request(app).get(
            `${API_VERSION}/${ROUTES.BLOGS}`
        )
        expect(res.status).toBe(HttpStatus.Ok)
        expect(res.body).toEqual(db.blogs)
    })

    // GET /blogs/:id
    it('should return a blog by id', async () => {
        const res = await request(app).get(
            `${API_VERSION}/${ROUTES.BLOGS}/1`
        )
        expect(res.status).toBe(HttpStatus.Ok)
        expect(res.body).toEqual(db.blogs[0])
    })
})
