import {CommentOutput} from "./comment-output";

export type PostListPaginatedOutput = {
    page: number;
    pageSize: number;
    pagesCount: number;
    totalCount: number;
    items: CommentOutput[];
}