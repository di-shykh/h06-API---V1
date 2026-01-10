import {CommentDB} from "../routes/output/commnent.db";
import {commentCollection} from "../../db/mongo.bd";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";
import {CommentInputDto} from "../application/dtos/comment.input-dto";

export const commentsRepository = {
    async createComment(comment: CommentDB): Promise<string> {
        const insertedComment = await commentCollection.insertOne(comment);
        return insertedComment.insertedId.toString();
    },
    async deleteComment(id: string): Promise<DeleteResult> {
        const deletedComments: DeleteResult = await commentCollection.deleteOne({_id: new ObjectId(id)})
        return deletedComments;
    },
    async updateComment(commentId: string, dto: CommentInputDto): Promise<UpdateResult> {
        const updatedComment = await commentCollection.updateOne(
            {_id: new ObjectId(commentId)},
            {
                $set: {
                    content: dto.content,
                }
            }
        );
        return updatedComment;
    }
}