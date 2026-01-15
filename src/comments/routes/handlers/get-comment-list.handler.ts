import {Request, Response} from "express";
import {errorHandler} from "../../../core/errors/error.handler";
import {CommentQueryInput} from "../input/comment-query.input";
import {matchedData} from "express-validator";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/set-default-sort-and-pagination";
import {commentsQueryRepository} from "../../repositories/comments.query-repository";
import {CommentListPaginatedOutput} from "../output/comment-list-paginated.output";
import {ResultObject} from "../../../core/result/result.type";
import {resultCodeToHttpException} from "../../../core/result/resultCodeToHttpExeptions";
import {HttpStatus} from "../../../core/types/http-statuses";
import {postsQueryRepository} from "../../../posts/repositories/posts.query-repository";

export async function getCommentListHandler(req: Request<{id: string}>, res: Response) {
    try{
        const { id: paramPostId } = req.params;

        if (!paramPostId) {
            return res.status(HttpStatus.BadRequest).json({
                errorsMessages: [{ message: "Post ID is required", field: "id" }]
            });
        }

        const post = await postsQueryRepository.findPostByIdOrFail(paramPostId);
        if (!post) {
            return res.status(HttpStatus.NotFound).json({
                errorsMessages: [{ message: "Post not found", field: "id" }]
            });
        }

        const query = req.query as unknown as CommentQueryInput;
        const sanitizedQuery = matchedData<CommentQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        });
        const postId = paramPostId /*|| sanitizedQuery.postId;*/
        const queryInput = setDefaultSortAndPaginationIfNotExist({
            ...sanitizedQuery,
            // ...(postId && { postId })
            // postId: paramPostId
        });

        // Проверяем, что pageSize и pageNumber из query используются
        console.log('Query params received:', query);
        console.log('Sanitized query:', sanitizedQuery);
        console.log('Query input after processing:', queryInput);

        const {items, totalCount} = await commentsQueryRepository.findManyComments(queryInput, postId);

        const commentsListOutput: CommentListPaginatedOutput = await commentsQueryRepository.mapToCommentListOutput(items,
            queryInput.pageNumber,
            queryInput.pageSize,
            totalCount,
        )
        const result = ResultObject.Success(commentsListOutput);
        res.status(HttpStatus.Ok).json(result.data)
    } catch (e) {
        errorHandler(e, res);
    }
}