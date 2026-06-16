export interface TicketListItem {
  ticketId: string;
  ticketNumber: string;
  title: string;
  status: string;
  priority: string;
  createdBy: string;
  assignedTo: string | null;
  categoryId: string | null;
  createdAt: string;
}
