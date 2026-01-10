import express from "express";
import {setupApp} from "../../../src/setup-app";
import {generateBasicAuthToken} from "../../utils/generate-admin-auth-token";
import {runDB, stopDb} from "../../../src/db/mongo.bd";
import {SETTINGS} from "../../../src/core/settings/settings";
import {clearDb} from "../../utils/clear-db";
import {loginGetToken} from "../../utils/login-get-token";
import {createComment} from "../../utils/comments/create-comment";
import {createPost} from "../../utils/posts/create-post";
import request from "supertest";
import {COMMENTS_PATH} from "../../../src/core/paths/paths";
import {HttpStatus} from "../../../src/core/types/http-statuses";
import {ObjectId} from "mongodb";

describe("Comments API", () => {
    const app = express();
    setupApp(app);

    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL_TEST);
        await clearDb(app);
    });
    afterAll(async () => {
        await stopDb();
    })
    it('should get comment: GET /hometask_06/api/comments/{id}', async () => {
        const token = await loginGetToken(app);
        const createdPost = await createPost(app);
        const comment = await createComment(app, token, createdPost.id, {content: "test content for e2e tests"});

        const result = await request(app)
            .get(`${COMMENTS_PATH}/${comment.id}`)
            .expect(HttpStatus.Ok);

        expect(result.body).toHaveProperty('id', comment.id);
        expect(result.body).toHaveProperty('content', 'test content for e2e tests');
        expect(result.body).toHaveProperty('commentatorInfo');
        expect(result.body).toHaveProperty('createdAt');

        expect(typeof result.body.id).toBe('string');
        expect(typeof result.body.createdAt).toBe('string');
        expect(typeof result.body.commentatorInfo.userId).toBe('string');
        expect(typeof result.body.commentatorInfo.userLogin).toBe('string');
        expect(new Date(result.body.createdAt).toISOString()).toBe(result.body.createdAt);

        expect(result.body.id).not.toBe('');
        expect(result.body.content).not.toBe('');
        expect(result.body.commentatorInfo.userId).not.toBe('');
        expect(result.body.commentatorInfo.userLogin).not.toBe('');
    })
    it('should not get comment with wrong id: GET /hometask_06/api/comments/{id}', async () => {
        const token = await loginGetToken(app);
        const createdPost = await createPost(app);
        const comment = await createComment(app, token, createdPost.id, {content: "test content for e2e tests"});
        const notExistingCommentId = new ObjectId().toString();

        const result = await request(app)
            .get(`${COMMENTS_PATH}/${notExistingCommentId}`)
            .expect(HttpStatus.NotFound);
    })
    it('should update comment, PUT /hometask_06/api/comments/{commentId}', async () => {
        const token = await loginGetToken(app);
        const createdPost = await createPost(app);
        const comment = await createComment(app, token, createdPost.id, {content: "test content for e2e tests"});

         await request(app)
            .put(`${COMMENTS_PATH}/${comment.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({content: "updated test content for e2e tests"})
            .expect(HttpStatus.NoContent);

        const result = await request(app)
            .get(`${COMMENTS_PATH}/${comment.id}`)
            .expect(HttpStatus.Ok);

        expect(result.body.content).toBe('updated test content for e2e tests');
    })
    it('should not update comment with wrong id, PUT /hometask_06/api/comments/{commentId}', async () => {
        const token = await loginGetToken(app);
        const createdPost = await createPost(app);
        const comment = await createComment(app, token, createdPost.id, {content: "test content for e2e tests"});
        const notExistingCommentId = new ObjectId().toString();

        await request(app)
            .put(`${COMMENTS_PATH}/${notExistingCommentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({content: "updated test content for e2e tests"})
            .expect(HttpStatus.NotFound);

        const result = await request(app)
            .get(`${COMMENTS_PATH}/${comment.id}`)
            .expect(HttpStatus.Ok);

        expect(result.body.content).toBe('test content for e2e tests');
    })
    it('should not update comment with invalid contetn, PUT /hometask_06/api/comments/{commentId}', async () => {
        const token = await loginGetToken(app);
        const createdPost = await createPost(app);
        const comment = await createComment(app, token, createdPost.id, {content: "test content for e2e tests"});

        await request(app)
            .put(`${COMMENTS_PATH}/${comment.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({content: "test"})
            .expect(HttpStatus.BadRequest);

        const result = await request(app)
            .get(`${COMMENTS_PATH}/${comment.id}`)
            .expect(HttpStatus.Ok);

        expect(result.body.content).toBe('test content for e2e tests');
    })
    it('should not update comment without valid token, PUT /hometask_06/api/comments/{commentId}', async () => {
        const token = await loginGetToken(app);
        const createdPost = await createPost(app);
        const comment = await createComment(app, token, createdPost.id, {content: "test content for e2e tests"});

        await request(app)
            .put(`${COMMENTS_PATH}/${comment.id}`)
            .send({content: "test"})
            .expect(HttpStatus.Unauthorized);

        const result = await request(app)
            .get(`${COMMENTS_PATH}/${comment.id}`)
            .expect(HttpStatus.Ok);

        expect(result.body.content).toBe('test content for e2e tests');
    })
})