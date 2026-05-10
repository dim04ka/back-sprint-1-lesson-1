// import { ROUTES } from '../../../src/core/path'
// import { db } from '../../../src/db/mongo.db'
// import { setupApp } from '../../../src/setup-app'
// import express from 'express'
// import request from 'supertest'

// describe('Testing API', () => {
//     const app = express()
//     setupApp(app)
//     it('should delete all data', async () => {
//         const res = await request(app).delete(
//             `${ROUTES.TESTING}/all-data`
//         )
//         expect(res.status).toBe(204)
//         expect(db.videos).toEqual([])
//         expect(db.blogs).toEqual([])
//         expect(db.posts).toEqual([])
//     })
// })
