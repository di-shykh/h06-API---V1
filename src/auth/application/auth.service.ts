import {usersRepository} from "../../users/repositories/user.repository";
import {bcryptService} from "../adapters/bcrypt.service";
import {jwtService} from "./jwt.service";
import {WithId} from "mongodb";
import {UserDB} from "../../users/routes/output/user.db";
import { v4 as uuidv4, v1 as uuidv1, v3 as uuidv3, v5 as uuidv5 } from 'uuid';
import { addHours, addDays, isAfter } from 'date-fns';
import {usersQueryRepository} from "../../users/repositories/user.query-repository";
import {DuplicateFieldError} from "../../core/errors/duplicateField.error";
import {UserCreateInput} from "../../users/routes/input/create-user.input";
import {emailAdapter} from "../adapters/email.adapter";

export const authService = {
    async loginUser(loginOrEmail: string, password: string): Promise<{accessToken: string}|null> {
        const user: WithId<UserDB>|null = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return null;
        const result = await bcryptService.checkPassword(password, user.passwordHash);
        if (!result) return null;
        const accessToken= await jwtService.createToken(user._id.toString());
        return {accessToken};
    },
    async createUser(userInputDto: UserCreateInput): Promise<string|null> {

        const {login, email, password} = userInputDto;
        const isLoginUnique = await usersQueryRepository.isLoginUnique(login);
        if (!isLoginUnique) {
            throw new DuplicateFieldError("login");
        }
        const isEmailUnique = await usersQueryRepository.isEmailUnique(email);
        if (!isEmailUnique) {
            throw new DuplicateFieldError("email");
        }
        const passwordHash: string = await bcryptService.generateHash(password);
        const confirmationCode: string = uuidv4();
        const expirationDate: string = addHours(new Date(), 24).toISOString();
        const newUser: UserDB = {
            login,
            email,
            passwordHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                isConfirmed: false,
                confirmationCode: confirmationCode,
                expirationDate: expirationDate,
            }
        }
        const newUserId = await usersRepository.createUser(newUser);
        try{
            await emailAdapter.sendConfirmationEmail(email, confirmationCode);
            return newUserId;
        } catch(err){
               await usersRepository.deleteUser(newUserId);
               return null;
            }
    }
}