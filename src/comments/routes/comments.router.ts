import {Router} from "express";
import {idValidator} from "../../core/middlewares/validation/params-id.validation-middleware";
import {getCommentHandler} from "./handlers/get-comment.handler";
import {AccessTokenGuard} from "../../auth/middlewares/access.token.guard";
import {deleteCommentHandler} from "./handlers/delete-comment.handler";
import {updateCommentHandler} from "./handlers/update-comment.handler";
import {commentInputValidation} from "./comment.input-dto.validation-middleware";

export const commentsRouter: Router = Router({});
commentsRouter
    .get(
        "/:id",
        idValidator,
        getCommentHandler
    )
    .delete(
        "/:id",
        AccessTokenGuard,
        idValidator,
        deleteCommentHandler
    )
    .put (
        "/:di",
        AccessTokenGuard,
        idValidator,
        commentInputValidation,
        updateCommentHandler
    )