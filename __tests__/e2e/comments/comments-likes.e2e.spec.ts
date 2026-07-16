import express, { Express } from 'express'
import request from 'supertest'

import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../../src/const'
import { ROUTES } from '../../../src/core/path'
import { HttpStatus } from '../../../src/core/types/http-statuses'
import { runDB, stopDb } from '../../../src/db/mongo.db'
import { setupApp } from '../../../src/setup-app'

type TestUser = {
    login: string
    email: string
    password: string
}

type TestComment = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
}

const commentContent = 'length_21-weqweqweqwq'
const password = 'qwerty123'

const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms))

const createUser = async (
    app: Express,
    user: TestUser
): Promise<void> => {
    await request(app)
        .post(ROUTES.USERS)
        .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
        .send(user)
        .expect(HttpStatus.Created)
}

const loginUser = async (
    app: Express,
    user: TestUser
): Promise<string> => {
    const res = await request(app)
        .post(`${ROUTES.AUTH}/login`)
        .send({
            loginOrEmail: user.login,
            password: user.password,
        })
        .expect(HttpStatus.Ok)

    return res.body.accessToken
}

const setCommentLikeStatus = async ({
    app,
    commentId,
    token,
    likeStatus,
}: {
    app: Express
    commentId: string
    token: string
    likeStatus: 'Like' | 'Dislike'
}): Promise<void> => {
    await request(app)
        .put(`${ROUTES.COMMENTS}/${commentId}/like-status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ likeStatus })
        .expect(HttpStatus.NoContent)
}

describe('Homework 11 Comment likes: GET /posts/:postId/comments', () => {
    jest.setTimeout(30_000)

    const app = express()
    setupApp(app)

    beforeAll(async () => {
        await runDB()
    })

    beforeEach(async () => {
        await request(app)
            .delete(`${ROUTES.TESTING}/all-data`)
            .expect(HttpStatus.NoContent)
    })

    afterAll(async () => {
        await stopDb()
    })

    it('should return comments with likesInfo for requested user', async () => {
        const users: TestUser[] = [
            {
                login: 'likeu1',
                email: 'like-user-1@example.com',
                password,
            },
            {
                login: 'likeu2',
                email: 'like-user-2@example.com',
                password,
            },
            {
                login: 'likeu3',
                email: 'like-user-3@example.com',
                password,
            },
            {
                login: 'likeu4',
                email: 'like-user-4@example.com',
                password,
            },
        ]

        for (const user of users) {
            await createUser(app, user)
        }

        const tokens = []
        for (const user of users) {
            tokens.push(await loginUser(app, user))
        }

        const blogRes = await request(app)
            .post(ROUTES.BLOGS)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .send({
                name: 'likes-blog',
                description: 'blog for comment likes test',
                websiteUrl: 'https://likes-blog.com',
            })
            .expect(HttpStatus.Created)

        const postRes = await request(app)
            .post(ROUTES.POSTS)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .send({
                title: 'likes post',
                shortDescription: 'post for comment likes test',
                content: 'post content for comment likes test',
                blogId: blogRes.body.id,
            })
            .expect(HttpStatus.Created)

        const comments: TestComment[] = []
        for (let i = 0; i < 6; i++) {
            const commentRes = await request(app)
                .post(`${ROUTES.POSTS}/${postRes.body.id}/comments`)
                .set('Authorization', `Bearer ${tokens[0]}`)
                .send({ content: commentContent })
                .expect(HttpStatus.Created)

            comments.push(commentRes.body)
            await delay(5)
        }

        await setCommentLikeStatus({
            app,
            commentId: comments[0].id,
            token: tokens[0],
            likeStatus: 'Like',
        })
        await setCommentLikeStatus({
            app,
            commentId: comments[0].id,
            token: tokens[1],
            likeStatus: 'Like',
        })

        await setCommentLikeStatus({
            app,
            commentId: comments[1].id,
            token: tokens[1],
            likeStatus: 'Like',
        })
        await setCommentLikeStatus({
            app,
            commentId: comments[1].id,
            token: tokens[2],
            likeStatus: 'Like',
        })

        await setCommentLikeStatus({
            app,
            commentId: comments[2].id,
            token: tokens[0],
            likeStatus: 'Dislike',
        })

        for (const token of tokens) {
            await setCommentLikeStatus({
                app,
                commentId: comments[3].id,
                token,
                likeStatus: 'Like',
            })
        }

        await setCommentLikeStatus({
            app,
            commentId: comments[4].id,
            token: tokens[1],
            likeStatus: 'Like',
        })
        await setCommentLikeStatus({
            app,
            commentId: comments[4].id,
            token: tokens[2],
            likeStatus: 'Dislike',
        })

        await setCommentLikeStatus({
            app,
            commentId: comments[5].id,
            token: tokens[0],
            likeStatus: 'Like',
        })
        await setCommentLikeStatus({
            app,
            commentId: comments[5].id,
            token: tokens[1],
            likeStatus: 'Dislike',
        })

        const res = await request(app)
            .get(`${ROUTES.POSTS}/${postRes.body.id}/comments`)
            .set('Authorization', `Bearer ${tokens[0]}`)
            .expect(HttpStatus.Ok)

        expect(res.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 6,
            items: [
                {
                    ...comments[5],
                    likesInfo: {
                        likesCount: 1,
                        dislikesCount: 1,
                        myStatus: 'Like',
                    },
                },
                {
                    ...comments[4],
                    likesInfo: {
                        likesCount: 1,
                        dislikesCount: 1,
                        myStatus: 'None',
                    },
                },
                {
                    ...comments[3],
                    likesInfo: {
                        likesCount: 4,
                        dislikesCount: 0,
                        myStatus: 'Like',
                    },
                },
                {
                    ...comments[2],
                    likesInfo: {
                        likesCount: 0,
                        dislikesCount: 1,
                        myStatus: 'Dislike',
                    },
                },
                {
                    ...comments[1],
                    likesInfo: {
                        likesCount: 2,
                        dislikesCount: 0,
                        myStatus: 'None',
                    },
                },
                {
                    ...comments[0],
                    likesInfo: {
                        likesCount: 2,
                        dislikesCount: 0,
                        myStatus: 'Like',
                    },
                },
            ],
        })
    })
})
