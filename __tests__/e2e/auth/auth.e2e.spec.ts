import express, {Express} from "express";
import {setupApp} from "../../../src/setup-app";
import {generateBasicAuthToken} from "../../utils/generate-admin-auth-token";
import {runDB, stopDb} from "../../../src/db/mongo.bd";
import {SETTINGS} from "../../../src/core/settings/settings";
import {clearDb} from "../../utils/clear-db";
import {getUserDto} from "../../utils/users/get-user-dto";
import {createUser} from "../../utils/users/create-user";
import request from "supertest";
import {AUTH_PATH} from "../../../src/core/paths/paths";
import {HttpStatus} from "../../../src/core/types/http-statuses";

describe("Check Auth: POST /auth/login", () => {
    const app: Express = express();
    setupApp(app);
    const adminToken: string = generateBasicAuthToken();
    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL_TEST);
        await clearDb(app);
    });
    afterAll(async () => {
        stopDb();
    });
    it("should send 200 status when authenticated", async () => {
        const user = await createUser(app, {
            ...getUserDto(),
            login: 'Anya',
            password: '12345678',
            email: 'anna@email.com'
        })

        const response = await request(app)
            .post(`${AUTH_PATH}/login`)
            .send({
                loginOrEmail: 'Anya',
                password: '12345678',
            })
            .expect(HttpStatus.Ok);

        expect(response.status).toEqual(HttpStatus.Ok);
        expect(response.body).toHaveProperty('accessToken');

        const response2 = await request(app)
            .post(`${AUTH_PATH}/login`)
            .send({
                loginOrEmail: 'anna@email.com',
                password: '12345678',
            })
            .expect(HttpStatus.Ok);
        expect(response2.status).toEqual(HttpStatus.Ok);
        expect(response2.body).toHaveProperty('accessToken');
    })
    it("should send 400 status when user was not found", async () => {

        const user = await createUser(app, {
            ...getUserDto(),
            login: 'Alya',
            password: '12345678',
            email: 'alya@email.com'
        })

        const response = await request(app)
            .post(`${AUTH_PATH}/login`)
            .send({
                loginOrEmail: '',
                password: '123456789',
            })
            .expect(HttpStatus.BadRequest);

        expect(response.status).toEqual(HttpStatus.BadRequest);

        const response2 = await request(app)
            .post(`${AUTH_PATH}/login`)
            .send({
                loginOrEmail: 'anuaf',
                password: '12345678',
            })
            .expect(HttpStatus.Unauthorized);

        expect(response2.status).toEqual(HttpStatus.Unauthorized);

        const response3 = await request(app)
            .post(`${AUTH_PATH}/login`)
            .send({
                loginOrEmail: 'alya@email.com',
                password: '1234567812',
            })
            .expect(HttpStatus.Unauthorized);

        expect(response3.status).toEqual(HttpStatus.Unauthorized);

        const response4 = await request(app)
            .post(`${AUTH_PATH}/login`)
            .send({
                loginOrEmail: 'alya1@email.com',
                password: '12345678',
            })
            .expect(HttpStatus.Unauthorized);

        expect(response4.status).toEqual(HttpStatus.Unauthorized);
        const response5 = await request(app)
            .post(`${AUTH_PATH}/login`)
            .send({
                loginOrEmail: 'sdfsdfsdfsfsdf',
                password: '',
            })
            .expect(HttpStatus.BadRequest);

        expect(response5.status).toEqual(HttpStatus.BadRequest);
    })
    it("should generate JWT token with valid credentials, and testing GET: auth/me", async () => {
        const user = await createUser(app, {
            ...getUserDto(),
            login: 'Mitya',
            password: '12345678910',
            email: 'fifa@gmail.com'
        });

        const response = await request(app)
         .post(`${AUTH_PATH}/login`)
         .send({
             loginOrEmail: user.login,
             password: '12345678910',
         })
        .expect(HttpStatus.Ok);

        expect(response.body).toHaveProperty('accessToken');

        const token = response.body['accessToken'];

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');

        const parts = token.split('.');
        expect(parts.length).toBe(3);

        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        expect(payload).toHaveProperty('userId');
        expect(payload).toHaveProperty('exp');
        expect(payload).toHaveProperty('iat');

        // Проверяем что токен можно использовать для доступа к защищенному роуту
        const protectedResponse = await request(app)
            .get(`${AUTH_PATH}/me`)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.Ok);
    })
    it("should login and get token", async () => {
        // Создаем пользователя
        const user = await createUser(app, {
            ...getUserDto(),
            login: 'TestUser',
            password: 'password123',
            email: 'test@example.com'
        });

        // Получаем токен
        const responce = await request(app)
            .post(`${AUTH_PATH}/login`)
            .send({
                loginOrEmail: 'TestUser',
                password: 'password123'
            })
            .expect(HttpStatus.Ok);
        const token = responce.body.accessToken;

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');

          // Используем токен для доступа к защищенному роуту
        const response = await request(app)
            .get(`${AUTH_PATH}/me`)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.Ok);

        expect(response.body.login).toBe('TestUser');
        expect(response.body.email).toBe('test@example.com');
        expect(response.body).toHaveProperty('id');
    });
    it("should reject unauthorized requests", async () => {
        await request(app)
            .get(`${AUTH_PATH}/me`)
            .expect(HttpStatus.Unauthorized);
    });
})
