import {Router} from "express";
import {getPostHandler} from "./handlers/get-post.handler";
import {getPostListHandler} from "./handlers/get-post-list.handler";
import {createPostHandler} from "./handlers/create-post.handler";
import {updatePostHandler} from "./handlers/update-post.handler";
import {deletePostHandler} from "./handlers/delete-post.handler";
import {idValidator} from "../../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validation.result.middleware";
import {
    postCreateInputValidation,
    postUpdateInputValidation
} from "./post.input-dto.validation-middlewares";
import {superAdminMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {paginationAndSortingValidation} from "../../core/middlewares/validation/query-pagination-sorting.validation";
import {PostSortField} from "./input/post-sort-field";
import {AccessTokenGuard} from "../../auth/middlewares/access.token.guard";
import {commentCreateValidation} from "../../comments/routes/comment.input-dto.validation-middleware";
import {createCommentHandler} from "../../comments/routes/handlers/create-comment.handler";

export const postsRouter: Router = Router({});

postsRouter
    .get(
        "",
        paginationAndSortingValidation(PostSortField),
        inputValidationResultMiddleware,
        getPostListHandler)
    .get(
        "/:id",
        idValidator,
        inputValidationResultMiddleware,
        getPostHandler)
    .post(
        "",
        superAdminMiddleware,
        postCreateInputValidation,
        inputValidationResultMiddleware,
        createPostHandler)
    .put(
        "/:id",
        superAdminMiddleware,
        idValidator,
        postUpdateInputValidation,
        inputValidationResultMiddleware,
        updatePostHandler)
    .delete(
        "/:id",
        superAdminMiddleware,
        idValidator,
        inputValidationResultMiddleware,
        deletePostHandler)
    .post(
        "/:id/comments",
        AccessTokenGuard,
        commentCreateValidation,
        createCommentHandler
    )