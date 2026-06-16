import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Badge, BadgeTone } from '../../components/ui/badge/badge';
import { I18nStore, TranslationKey } from '../../i18n/i18n-store';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { formatTicketNumber, TicketPriority, TicketStatus } from '../../models/tickets';
import { MembersStore } from '../../state/companies';
import { TenantStore } from '../../state/tenant';
import { TicketDetailStore } from '../../state/tickets';

interface TimelineEvent {
  labelKey: TranslationKey;
  date: string | null;
}

@Component({
  selector: 'app-ticket-detail-page',
  imports: [DatePipe, RouterLink, TranslatePipe, Badge],
  templateUrl: './ticket-detail-page.html',
  styleUrl: './ticket-detail-page.css',
})
export class TicketDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tenant = inject(TenantStore);
  private readonly members = inject(MembersStore);
  protected readonly store = inject(TicketDetailStore);

  protected readonly formatNumber = formatTicketNumber;

  private readonly memberNames = computed(() => {
    const map = new Map<string, string>();
    for (const member of this.members.members()) {
      if (member.accountId) {
        map.set(member.accountId, member.displayName?.trim() || member.email);
      }
    }
    return map;
  });

  protected readonly timeline = computed<TimelineEvent[]>(() => {
    const detail = this.store.detail();
    if (!detail) {
      return [];
    }
    return [
      { labelKey: 'ticketDetailPage.timeline.created', date: detail.createdAt },
      { labelKey: 'ticketDetailPage.timeline.updated', date: detail.updatedAt },
      { labelKey: 'ticketDetailPage.timeline.resolved', date: detail.resolvedAt },
      { labelKey: 'ticketDetailPage.timeline.closed', date: detail.closedAt },
    ];
  });

  ngOnInit(): void {
    const companyId = this.tenant.activeCompanyId();
    if (companyId) {
      this.members.load(companyId);
    }
    const ticketId = this.route.snapshot.paramMap.get('id');
    if (ticketId) {
      this.store.load(ticketId);
    }
  }

  protected statusLabelKey(status: string): TranslationKey {
    return ('ticketDetailPage.status.' + status) as TranslationKey;
  }

  protected priorityLabelKey(priority: string): TranslationKey {
    return ('ticketForm.priorities.' + priority) as TranslationKey;
  }

  protected statusTone(status: string): BadgeTone {
    switch (status) {
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
  }

  protected priorityTone(priority: string): BadgeTone {
    switch (priority) {
      case TicketPriority.Medium:
        return 'accent';
      case TicketPriority.High:
        return 'amber';
      case TicketPriority.Urgent:
        return 'danger';
      default:
        return 'neutral';
    }
  }

  protected memberName(accountId: string | null): string | null {
    if (!accountId) {
      return null;
    }
    return this.memberNames().get(accountId) ?? accountId;
  }
}
