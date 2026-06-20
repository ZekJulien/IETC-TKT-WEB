import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '../../../i18n/translate-pipe';
import { ticketStatusLabelKey, TicketStatus } from '../../../models/tickets';
import { Badge, BadgeTone } from '../badge/badge';

@Component({
  selector: 'app-ticket-status-badge',
  imports: [TranslatePipe, Badge],
  templateUrl: './ticket-status-badge.html',
})
export class TicketStatusBadge {
  readonly status = input.required<string>();

  protected readonly labelKey = computed(() => ticketStatusLabelKey(this.status()));

  protected readonly tone = computed<BadgeTone>(() => {
    switch (this.status()) {
      case TicketStatus.Open:
        return 'info';
      case TicketStatus.InProgress:
        return 'accent';
      case TicketStatus.Pending:
        return 'amber';
      case TicketStatus.Resolved:
        return 'violet';
      default:
        return 'neutral';
    }
  });
}
