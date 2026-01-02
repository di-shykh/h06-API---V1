import {ResultStatus} from "./result.code";
import {HttpStatus} from "../types/http-statuses";

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
    switch (resultCode) {
        case ResultStatus.Forbidden:
            return HttpStatus.Forbidden;
        case ResultStatus.BadRequest:
            return HttpStatus.BadRequest;
        default:
            return HttpStatus.InternalServerError;
    }
}