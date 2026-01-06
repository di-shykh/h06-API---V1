import {CommentDB} from "../routes/output/commnent.db";
import {commentCollection} from "../../db/mongo.bd";
import {DeleteResult} from "mongodb";

export const commentsRepository = {
    async createComment(comment: CommentDB): Promise<string> {
        const insertedComment = await commentCollection.insertOne(comment);
        return insertedComment.insertedId.toString();
    },
    async deleteComment(id: string): Promise<DeleteResult> {
        const deletedComments: DeleteResult = await commentCollection.deleteOne({id: new Object(id)})
        return deletedComments;
    }
}