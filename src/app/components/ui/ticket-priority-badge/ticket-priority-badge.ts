import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '../../../i18n/translate-pipe';
import { ticketPriorityLabelKey, TicketPriority } from '../../../models/tickets';
import { Badge, BadgeTone } from '../badge/badge';

@Component({
  selector: 'app-ticket-priority-badge',
  imports: [TranslatePipe, Badge],
  templateUrl: './ticket-priority-badge.html',
})
export class TicketPriorityBadge {
  readonly priority = input.required<string>();

  protected readonly labelKey = computed(() => ticketPriorityLabelKey(this.priority()));

  protected readonly tone = computed<BadgeTone>(() => {
    switch (this.priority()) {
      case TicketPriority.Medium:
        return 'accent';
      case TicketPriority.High:
        return 'amber';
      case TicketPriority.Urgent:
        return 'danger';
      default:
        return 'neutral';
    }
  });
}
