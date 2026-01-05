import {CommentDB} from "../routes/output/commnent.db";
import {commentCollection} from "../../db/mongo.bd";

export const commentsRepository = {
    async createComment(comment: CommentDB): Promise<string> {
        const insertedComment = await commentCollection.insertOne(comment);
        return insertedComment.insertedId.toString();
    }
}