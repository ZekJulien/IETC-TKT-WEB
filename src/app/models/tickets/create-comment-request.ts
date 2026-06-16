export interface CreateCommentRequest {
  content: string;
  isInternal: boolean;
  replyToId?: string;
}
