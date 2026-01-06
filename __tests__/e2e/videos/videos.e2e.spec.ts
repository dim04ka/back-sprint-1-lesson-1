import request from 'supertest'

import express from 'express'
import { setupApp } from '../../../src/setup-app'
import { db } from '../../../src/db'
import { Resolution } from '../../../src/types'
import { HttpStatus } from '../../../src/types'

describe('Videos API', () => {
    const app = express()
    setupApp(app)

    describe('GET /videos', () => {
        it('should return all videos', async () => {
            const res = await request(app).get('/videos')
            expect(res.status).toBe(HttpStatus.Ok)
            expect(res.body).toEqual(db.videos)
        })
    })

    describe('POST /videos', () => {
        it('should create a new video', async () => {
            const res = await request(app)
                .post('/videos')
                .send({
                    title: 'Test Video',
                    author: 'Test Author',
                    availableResolutions: [Resolution.x144],
                })
            expect(res.status).toBe(HttpStatus.Created)
            expect(res.body).toEqual({
                id: expect.any(Number),
                title: 'Test Video',
                author: 'Test Author',
                canBeDownloaded: false,
                minAgeRestriction: null,
                createdAt: expect.any(String),
                publicationDate: expect.any(String),
                availableResolutions: [Resolution.x144],
            })
        })
    })

    describe('POST /videos with incorrect body', () => {
        it('should return error if passed body is incorrect', async () => {
            const res = await request(app)
                .post('/videos')
                .send({
                    title: '',
                    author: 'Test Author',
                    availableResolutions: [Resolution.x144],
                })
            expect(res.status).toBe(HttpStatus.BadRequest)
            expect(res.body).toEqual({
                errorsMessages: [
                    {
                        message:
                            'Title is required and must be between 1 and 40 characters',
                        field: 'title',
                    },
                ],
            })
        })
    })

    describe('POST /videos with incorrect title', () => {
        it('should return error if passed title is incorrect', async () => {
            const res = await request(app)
                .post('/videos')
                .send({
                    title: null,
                    author: 'Test Author',
                    availableResolutions: [Resolution.x144],
                })
            expect(res.status).toBe(HttpStatus.BadRequest)
            expect(res.body).toEqual({
                errorsMessages: [
                    {
                        message:
                            'Title is required and must be between 1 and 40 characters',
                        field: 'title',
                    },
                ],
            })
        })
    })

    describe('PUT /videos/:id', () => {
        it('should update a video', async () => {
            const res = await request(app)
                .put('/videos/1')
                .send({
                    title: 'Updated Test Video',
                    author: 'Test Author',
                    availableResolutions: [Resolution.x144],
                    canBeDownloaded: true,
                    minAgeRestriction: 18,
                    publicationDate: new Date().toISOString(),
                })

            const getRes = await request(app).get('/videos/1')
            expect(getRes.body).toEqual({
                id: 1,
                title: 'Updated Test Video',
                author: 'Test Author',
                canBeDownloaded: true,
                minAgeRestriction: 18,
                createdAt: expect.any(String),
                publicationDate: expect.any(String),
                availableResolutions: [Resolution.x144],
            })
            expect(res.status).toBe(HttpStatus.NoContent)
        })
    })
})
