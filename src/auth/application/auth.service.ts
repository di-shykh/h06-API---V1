import {usersRepository} from "../../users/repositories/user.repository";
import {bcryptService} from "../adapters/bcrypt.service";
import {jwtService} from "./jwt.service";
import {WithId} from "mongodb";
import {UserDB} from "../../users/routes/output/user.db";

export const authService = {
    async loginUser(loginOrEmail: string, password: string): Promise<{accessToken: string}|null> {
        const user: WithId<UserDB>|null = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return null;
        const result = await bcryptService.checkPassword(password, user.passwordHash);
        if (!result) return null;
        const accessToken= await jwtService.createToken(user._id.toString());
        return {accessToken};
    }
}