import {Router} from "express";
import {getBlogHandler} from "./handlers/get-blog.handler";
import {getBlogListHandler} from "./handlers/get-blog-list.handler";
import {createBlogHandler} from "./handlers/create-blog.handler";
import {updateBlogHandler} from "./handlers/update-blog.handler";
import {deleteBlogHandler} from "./handlers/delete-blog.handler";
import {idValidator} from "../../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validation.result.middleware";
import {blogCreateInputValidation, blogUpdateInputValidation} from "./blog.input-dto.validation-middleware";
import {superAdminMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {paginationAndSortingValidation} from "../../core/middlewares/validation/query-pagination-sorting.validation";
import {BlogSortField} from "./input/blog-sort-field";
import {getBlogPostListHandler} from "./handlers/get-blog-post-list.handler";
import {PostSortField} from "../../posts/routes/input/post-sort-field";
import {postCreateForBlogInputValidation} from "../../posts/routes/post.input-dto.validation-middlewares";
import {createBlogPostHandler} from "./handlers/create-blog-post.handler";
import {blogExistingIdValidationMiddleware} from "./blog.existing-id-validation-middleware";

export const blogsRouter: Router = Router({});

blogsRouter
    .get(
        "",
        paginationAndSortingValidation(BlogSortField),
        inputValidationResultMiddleware,
        getBlogListHandler,
    )

    .get(
        "/:id",
        idValidator,
        inputValidationResultMiddleware,
        getBlogHandler)
    .post(
        "",
        superAdminMiddleware,
        blogCreateInputValidation,
        inputValidationResultMiddleware,
        createBlogHandler
    )
    .put(
        "/:id",
        superAdminMiddleware,
        idValidator,
        blogUpdateInputValidation,
        inputValidationResultMiddleware,
        updateBlogHandler
    )
    .delete(
        "/:id",
        superAdminMiddleware,
        idValidator,
        inputValidationResultMiddleware,
        deleteBlogHandler
    )
    .get(
        "/:id/posts",
        idValidator,
        blogExistingIdValidationMiddleware,
        paginationAndSortingValidation(PostSortField),
        inputValidationResultMiddleware,
        getBlogPostListHandler,
    )
    .post(
        "/:id/posts",
        superAdminMiddleware,
        idValidator,
        blogExistingIdValidationMiddleware,
        postCreateForBlogInputValidation,
        inputValidationResultMiddleware,
        createBlogPostHandler
    )
