import {errorHandler} from "../../../core/errors/error.handler";
import {Response, Request} from "express";
import {authService} from "../../application/auth.service";
import {ResultStatus} from "../../../core/result/result.code";
import {resultCodeToHttpException} from "../../../core/result/resultCodeToHttpExeptions";
import {HttpStatus} from "../../../core/types/http-statuses";

export async function registrationConfirmationHandler(req: Request, res: Response) {
    try {
        const codeFromEmail: string = req.query.code as string;
        const result = await authService.confirmUserRegistration(codeFromEmail);
        if(result.status!== ResultStatus.Success){
            res.status(resultCodeToHttpException(result.status)).json({
                errorsMessages: result.extensions||[]
            });
            return;
        }
        res.status(HttpStatus.NoContent).send();
    } catch (e) {
        errorHandler(e, res);
    }
}