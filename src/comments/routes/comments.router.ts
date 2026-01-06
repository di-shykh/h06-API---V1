import {Router} from "express";
import {idValidator} from "../../core/middlewares/validation/params-id.validation-middleware";
import {getCommentHandler} from "./handlers/get-comment.handler";
import {authGetHandler} from "../../auth/routes/auth.get-user.handler";
import {AccessTokenGuard} from "../../auth/middlewares/access.token.guard";
import {deleteCommentHandler} from "./handlers/delete-comment.handler";

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
        updateCommentHandler
    )