import {PaginationAndSorting} from "../../../core/types/pagination-and-sorting";
import {CommentSortField} from "./comment-sort-field";

export type CommentQueryInput = PaginationAndSorting<CommentSortField> & Partial<{
  postId?: string;
  userId?: string;
  userLogin?: string;
  createdAt?: string;
  searchContentTerm?: string;
}>