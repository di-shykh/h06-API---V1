import {Request, Response} from "express";
import {errorHandler} from "../../../core/errors/error.handler";

export async function getCommentListHandler(req: Request, res: Response) {
    try{
        const query = req.query as CommentQueryInput;
    } catch (e) {
        errorHandler(e, res);
    }
}