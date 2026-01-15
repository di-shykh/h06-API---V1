import {CommentInputDto} from "../../application/dtos/comment.input-dto";
import {Request, Response} from 'express';
import {errorHandler} from "../../../core/errors/error.handler";
import {commentsService} from "../../application/comment.services";
import {CommentOutput} from "../output/comment-output";
import {Result} from "../../../core/result/result.type";
import {ResultStatus} from "../../../core/result/result.code";
import {resultCodeToHttpException} from "../../../core/result/resultCodeToHttpExeptions";
import {HttpStatus} from "../../../core/types/http-statuses";
import {postsQueryRepository} from "../../../posts/repositories/posts.query-repository";
import {WithId} from "mongodb";
import {Post} from "../../../posts/domain/post";

export async function createCommentHandler(
    req: Request<{id: string},{},CommentInputDto>,
    res: Response): Promise<void> {
    try{
        const postId: string = req.params.id;
        const post: WithId<Post> = await postsQueryRepository.findPostByIdOrFail(postId);
        const commentInput: CommentInputDto = req.body;
        const userId: string = req.userId as string;

        const result: Result<CommentOutput|null> = await commentsService.createComment(postId, userId, commentInput);

        if(result.status!== ResultStatus.Created){
             res.status(resultCodeToHttpException(result.status)).json({
                errorsMessages: result.extensions
            });
            return;
        }
        res.status(HttpStatus.Created).json(result.data);
    } catch (e) {
        errorHandler(e,res);
    }
}