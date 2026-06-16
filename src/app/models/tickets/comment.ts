export interface Comment {
  commentId: string;
  ticketId: string;
  accountId: string;
  replyToId: string | null;
  content: string;
  isInternal: boolean;
  editedAt: string | null;
  createdAt: string;
}
