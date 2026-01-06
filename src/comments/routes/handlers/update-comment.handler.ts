import {Response, Request} from 'express';
import {errorHandler} from "../../../core/errors/error.handler";

export async function updateCommentHandler(req: Request<{id: string}>, res: Response) {
    try {
        const id: string = req.params.id;
        const userId: string = req.userId as string;
    } catch (e) {
        errorHandler(e,res);
    }
}