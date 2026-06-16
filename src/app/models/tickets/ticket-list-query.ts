export type TicketSort = 'created_at' | 'priority' | 'status';

export const TICKET_SORTS: readonly TicketSort[] = ['created_at', 'priority', 'status'];

export interface TicketListQuery {
  status?: string;
  priority?: string;
  assignedTo?: string;
  categoryId?: string;
  sort?: TicketSort;
  page?: number;
  pageSize?: number;
}
