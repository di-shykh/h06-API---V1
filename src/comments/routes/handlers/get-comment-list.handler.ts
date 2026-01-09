import {Request, Response} from "express";
import {errorHandler} from "../../../core/errors/error.handler";
import {CommentQueryInput} from "../input/comment-query.input";
import {matchedData} from "express-validator";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/set-default-sort-and-pagination";
import {commentsQueryRepository} from "../../repositories/comments.query-repository";
import {CommentListPaginatedOutput} from "../output/comment-list-paginated.output";
import {ResultObject} from "../../../core/result/resul.type";
import {resultCodeToHttpException} from "../../../core/result/resultCodeToHttpExeptions";
import {HttpStatus} from "../../../core/types/http-statuses";

export async function getCommentListHandler(req: Request, res: Response) {
    try{
        const { postId: paramPostId } = req.params;

        const query = req.query as unknown as CommentQueryInput;
        const sanitizedQuery = matchedData<CommentQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        });
        const postId = paramPostId || sanitizedQuery.postId;
        const queryInput = setDefaultSortAndPaginationIfNotExist({
            ...sanitizedQuery,
            ...(postId && { postId })
        });
        const {items, totalCount} = await commentsQueryRepository.findManyComments(queryInput);

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