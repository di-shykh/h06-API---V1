import {Router} from "express";
import {idValidator} from "../../core/middlewares/validation/params-id.validation-middleware";
import {getCommentHandler} from "./handlers/get-comment.handler";

export const commentsRouter: Router = Router({});
commentsRouter
    .get(
        "/:id",
        idValidator,
        getCommentHandler
    )
    .delete(
        "/:id",
        idValidator,
        deleteCommentHandler
    )