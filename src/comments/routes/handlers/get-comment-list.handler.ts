import {Request, Response} from "express";
import {errorHandler} from "../../../core/errors/error.handler";
import {CommentQueryInput} from "../input/comment-query.input";
import {matchedData} from "express-validator";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/set-default-sort-and-pagination";
import {commentsQueryRepository} from "../../repositories/comments.query-repository";
import {CommentListPaginatedOutput} from "../output/comment-list-paginated.output";

export async function getCommentListHandler(req: Request, res: Response) {
    try{
        const query = req.query as unknown as CommentQueryInput;
        const sanitizedQuery = matchedData<CommentQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        });
        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);
        const {items, totalCount} = await commentsQueryRepository.findManyComments(queryInput);
        const commentsListOutput: CommentListPaginatedOutput = commentsQueryRepository.mapToCommentListOutput(items,
            queryInput.pageNumber,
            queryInput.pageSize,
            totalCount,
        )
    } catch (e) {
        errorHandler(e, res);
    }
}