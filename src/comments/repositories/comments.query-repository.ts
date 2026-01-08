import {ObjectId, WithId} from "mongodb";
import {CommentDB} from "../routes/output/commnent.db";
import {commentCollection, userCollection} from "../../db/mongo.bd";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {CommentOutput} from "../routes/output/comment-output";
import {UserDB} from "../../users/routes/output/user.db";
import {CommentQueryInput} from "../routes/input/comment-query.input";

export const commentsQueryRepository = {
    async findCommentById(id: string): Promise<WithId<CommentDB>> {
        const result = await commentCollection.findOne({_id: new ObjectId(id)});
        if (!result) {
            throw new RepositoryNotFoundError("Comment not found.");
        }
        return result;
    },
    async findManyComments(queryDto: CommentQueryInput): Promise<{items: WithId<Comment>[], totalCount: number}> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchContentTerm,
        } = queryDto;
        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};
        if (searchContentTerm) {
            filter.content = { $regex: searchContentTerm, $options: "i" };
        }
        const items: WithId<Comment[]> = await commentCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray()
        ;
    },
    async mapToCommentOutput(comment: WithId<CommentDB>): Promise<CommentOutput> {
        const user: WithId<UserDB> | null = await userCollection.findOne({_id: new ObjectId(comment.userId)});
        if (!user) {
            throw new RepositoryNotFoundError("User not found.");
        }
        const commentOutput: CommentOutput = {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.userId,
                userLogin: user.login
            },
            createdAt: comment.createdAt,
        }
        return commentOutput;
    },
    async mapToCommentListOutput() {

    }
}


