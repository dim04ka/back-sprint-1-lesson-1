import request from 'supertest'

import express from 'express'
import { setupApp } from '../../../src/setup-app'
import { db } from '../../../src/db'
import { HttpStatus } from '../../../src/core/types/http-statuses'
import { ROUTES } from '../../../src/core/path'
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../../../src/const'

describe('Blogs API', () => {
    const app = express()
    setupApp(app)

    // GET /blogs
    it('should return all blogs', async () => {
        const res = await request(app).get(`${ROUTES.BLOGS}`)
        expect(res.status).toBe(HttpStatus.Ok)
        expect(res.body).toEqual(db.blogs)
    })

    // GET /blogs/:id
    it('should return a blog by id', async () => {
        const res = await request(app).get(`${ROUTES.BLOGS}/1`)
        expect(res.status).toBe(HttpStatus.Ok)
        expect(res.body).toEqual(db.blogs[0])
    })

    it('should create a new blog', async () => {
        const newBlog = {
            name: 'Test Blog',
            description: 'Test Description',
            websiteUrl: 'https://test.com',
        }
        const res = await request(app)
            .post(`${ROUTES.BLOGS}`)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .send(newBlog)
        expect(res.status).toBe(HttpStatus.Created)
    })

    it('should update a blog', async () => {
        const updatedBlog = {
            nam: 'Updated Blog',
            description: 'description',
            websiteUrl: 'invalid-url',
        }
        const res = await request(app)
            .put(`${ROUTES.BLOGS}/11111`)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .send(updatedBlog)
        expect(res.status).toBe(HttpStatus.BadRequest)
    })
})
