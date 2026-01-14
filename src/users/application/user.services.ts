import {UserCreateInput} from "../routes/input/create-user.input";
import {usersQueryRepository} from "../repositories/user.query-repository";
import {bcryptService} from "../../auth/adapters/bcrypt.service";
import {UserDB} from "../routes/output/user.db";
import {usersRepository} from "../repositories/user.repository";
import {DuplicateFieldError} from "../../core/errors/duplicateField.error";

export const usersService = {
    async createUser(userInputDto: UserCreateInput): Promise<string> {
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

        const newUser: UserDB = {
            login,
            email,
            passwordHash,
            createdAt: new Date().toISOString(),
        }
        const newUserId = await usersRepository.createUser(newUser);
        return newUserId;
    },
    async deleteUser(id: string): Promise<void> {
        await usersRepository.deleteUser(id);
    }

}