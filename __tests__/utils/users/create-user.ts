import {Express} from "express";
import {UserOutput} from "../../../src/users/routes/output/user-output";
import {UserInputDto} from "../../../src/users/application/dtos/user.input-dto";
import {getUserDto} from "./get-user-dto";
import {USERS_PATH} from "../../../src/core/paths/paths";
import request from "supertest";
import {generateBasicAuthToken} from "../generate-admin-auth-token";
import {HttpStatus} from "../../../src/core/types/http-statuses";

export async function createUser(app: Express, userDto: UserInputDto): Promise<UserOutput> {
    // const testUserData = {
    //     ...getUserDto(),
    //     ...userDto,
    // }
    const createUserResponse = await request(app)
        .post(USERS_PATH)
        .set('Authorization', generateBasicAuthToken())
        // .send(testUserData)
        .send(userDto)
        .expect(HttpStatus.Created);
    return createUserResponse.body;
}