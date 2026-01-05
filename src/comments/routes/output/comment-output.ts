import {CommentatorInfo} from "../../types/commentator-info";

export type CommentOutput = {
    id: string;
    content: string;
    commentatorInfo: CommentatorInfo;
    createdAt: string;
}