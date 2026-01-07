import {Response, Request} from 'express';
import {errorHandler} from "../../../core/errors/error.handler";
import {commentsService} from "../../application/comment.services";
import {CommentInputDto} from "../../application/dtos/comment.input-dto";
import {ResultStatus} from "../../../core/result/result.code";
import {resultCodeToHttpException} from "../../../core/result/resultCodeToHttpExeptions";
import {HttpStatus} from "../../../core/types/http-statuses";

export async function updateCommentHandler(req: Request, res: Response) {
    try {
        const commentId: string = req.params.id as string;
        const userId: string = req.userId as string;
        const content: CommentInputDto = req.body.content;

        const result = await commentsService.updateComment(commentId, userId, content)
        if (result.status === ResultStatus.Forbidden) {
            res.status(resultCodeToHttpException(ResultStatus.Forbidden)).json({
                errorsMessages: result.errorMessage,
            });
            return;
        }
        if (result.status === ResultStatus.NotFound) {
            res.status(resultCodeToHttpException(ResultStatus.NotFound)).json({
                errorsMessages: result.errorMessage,
            })
            return;
        }
        if(result.status === ResultStatus.NoContent) {
            res.sendStatus(HttpStatus.NoContent);
        }
    } catch (e) {
        errorHandler(e,res);
    }
}