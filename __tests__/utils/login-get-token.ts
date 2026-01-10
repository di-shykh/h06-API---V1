import {createUser} from "./users/create-user";
import {getUserDto} from "./users/get-user-dto";
import request from "supertest";
import {AUTH_PATH} from "../../src/core/paths/paths";
import {HttpStatus} from "../../src/core/types/http-statuses";
import express, {Express} from "express";
import {setupApp} from "../../src/setup-app";

export const loginGetToken = async () => {
    // Создаем пользователя
    const app: Express = express();
    setupApp(app);
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
    return token;
}