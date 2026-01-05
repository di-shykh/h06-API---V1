import {CommentInputDto} from "./dtos/comment.input-dto";
import {postsQueryRepository} from "../../posts/repositories/posts.query-repository";
import {ResultStatus} from "../../core/result/result.code";
import {Result, ResultObject} from "../../core/result/resul.type";
import {CommentDB} from "../routes/output/commnent.db";
import {commentsRepository} from "../repositories/comments.repository";
import {commentsQueryRepository} from "../repositories/comments.query-repository";
import {WithId} from "mongodb";
import {CommentOutput} from "../routes/output/comment-output";

export const commentsService = {
    async createComment(postId: string, userId: string, dto: CommentInputDto): Promise<Result<CommentOutput|null>> {
        const post = await postsQueryRepository.findPostByIdOrFail(postId);
        if (!post) {
            return ResultObject.NotFound('postId', 'Post with this Id is not exist');
        }
        const newComment: CommentDB = {
            content: dto.content,
            userId,
            postId,
            createdAt: new Date().toISOString(),
        }
        const createdCommentId: string = await commentsRepository.createComment(newComment);
        const createdComment: WithId<CommentDB> = await commentsQueryRepository.findCommentById(createdCommentId);
        const createdCommentOutput: CommentOutput = await commentsQueryRepository.mapToCommentOutput(createdComment);
        return ResultObject.Created(createdCommentOutput);
    },
    async updateComment(commentId: string, dto: CommentInputDto): Promise<Result> {

    },
    async deleteComment(postId: string, userId: string, dto: CommentInputDto): Promise<Result> {}
}