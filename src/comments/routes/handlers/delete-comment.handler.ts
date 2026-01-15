import {Request, Response} from "express";
import {commentsService} from "../../application/comment.services";
import {Result} from "../../../core/result/result.type";
import {ResultStatus} from "../../../core/result/result.code";
import {resultCodeToHttpException} from "../../../core/result/resultCodeToHttpExeptions";
import {errorHandler} from "../../../core/errors/error.handler";
import {HttpStatus} from "../../../core/types/http-statuses";

export async function deleteCommentHandler(req: Request<{id: string}>, res: Response): Promise<void> {
    try {
        const id: string = req.params.id;
        const userId: string = req.userId as string;
        const result: Result = await commentsService.deleteComment(userId, id);
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