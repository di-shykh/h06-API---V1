import {UserDB} from "../routes/output/user.db";
import {userCollection} from "../../db/mongo.bd";
import {ObjectId, WithId} from "mongodb";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";

export const usersRepository = {
    async createUser(newUser: UserDB): Promise<string> {
        const insertedUser = await userCollection.insertOne(newUser);
        return insertedUser.insertedId.toString();
    },
    async deleteUser(id: string): Promise<void> {
        const deletedUser = await userCollection.deleteOne({_id: new ObjectId(id)});
        if(deletedUser.deletedCount<1) {
            throw new RepositoryNotFoundError("User not found");
        }
        return;
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDB>|null> {
        return await userCollection.findOne({
            $or: [{login: loginOrEmail }, { email: loginOrEmail }],
        });
    },
    async confirmEmail(code: string): Promise<boolean|null> {
        try {
            const result = await userCollection.updateOne(
                {"emailConfirmation.confirmationCode" : code},
                { $set: {"emailConfirmation.isConfirmed" : true}}
            );
            return result.modifiedCount === 1;
        } catch (error) {
            console.error("Error confirming email:", error);
            return false;
        }
    }
}