import {errorHandler} from "../../../core/errors/error.handler";
import {Request, Response} from "express";
import {commentsQueryRepository} from "../../repositories/comments.query-repository";
import {ResultObject} from "../../../core/result/resul.type";
import {resultCodeToHttpException} from "../../../core/result/resultCodeToHttpExeptions";
import {HttpStatus} from "../../../core/types/http-statuses";

export async function getCommentHandler(req: Request, res: Response): Promise<void> {
    try{
        const id = req.params.id as string;
        const comment = await commentsQueryRepository.findCommentById(id);
        if (!comment) {
            const result = ResultObject.NotFound('commentId', 'Post with this Id is not exist');
            res.status(resultCodeToHttpException(result.status)).json({
                errorsMesages: result.extensions
            });
            return;
        }
        const commentOutput = await commentsQueryRepository.mapToCommentOutput(comment);
        const result = ResultObject.Success(commentOutput);
        res.status(HttpStatus.Ok).json(result.data);

    } catch (e) {
        errorHandler(e,res);
    }
}