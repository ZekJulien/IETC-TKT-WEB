import { TicketListItem } from './ticket-list-item';

export interface TicketListResponse {
  items: TicketListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  statusCounts: Record<string, number>;
}
