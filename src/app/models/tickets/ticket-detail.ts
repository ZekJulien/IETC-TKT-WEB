export interface TicketDetail {
  ticketId: string;
  ticketNumber: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  createdBy: string;
  assignedTo: string | null;
  teamId: string | null;
  categoryId: string | null;
  source: string;
  dueDate: string | null;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
}
