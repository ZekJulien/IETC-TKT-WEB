import { PagedResult } from '../paged-result';
import { TicketListItem } from './ticket-list-item';

export interface TicketListResponse extends PagedResult<TicketListItem> {
  statusCounts: Record<string, number>;
}
