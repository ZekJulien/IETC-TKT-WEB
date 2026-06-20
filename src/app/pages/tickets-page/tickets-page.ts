import { Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppRoute } from '../../app-route';
import { TicketsTable } from '../../components/tickets-table/tickets-table';
import { TicketsToolbar } from '../../components/tickets-toolbar/tickets-toolbar';
import { Button } from '../../components/ui/button/button';
import { TranslationKey } from '../../i18n/i18n-store';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { ticketStatusLabelKey, TICKET_STATUSES, TicketStatus } from '../../models/tickets';
import { DirectoryStore } from '../../state/companies';
import { TenantStore } from '../../state/tenant';
import { TICKET_PAGE_SIZES, TicketsListStore } from '../../state/tickets';

interface StatusCounter {
  status: TicketStatus;
  labelKey: TranslationKey;
  count: number;
}

@Component({
  selector: 'app-tickets-page',
  imports: [RouterLink, TranslatePipe, TicketsTable, TicketsToolbar, Button],
  templateUrl: './tickets-page.html',
  styleUrl: './tickets-page.css',
})
export class TicketsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tenant = inject(TenantStore);
  private readonly directory = inject(DirectoryStore);
  protected readonly store = inject(TicketsListStore);

  protected readonly newTicketRoute = '/' + AppRoute.CreateTicket;
  protected readonly pageSizes = TICKET_PAGE_SIZES;

  protected readonly counters = computed<StatusCounter[]>(() => {
    const counts = this.store.statusCounts();
    return TICKET_STATUSES.map((status) => ({
      status,
      labelKey: ticketStatusLabelKey(status),
      count: counts[status] ?? 0,
    }));
  });

  ngOnInit(): void {
    const companyId = this.tenant.activeCompanyId();
    if (companyId) {
      this.directory.ensure(companyId);
    }
    const params = this.route.snapshot.queryParamMap;
    const rawStatus = params.get('status');
    const status = rawStatus && (TICKET_STATUSES as readonly string[]).includes(rawStatus)
      ? rawStatus
      : null;
    this.store.applyQuery({ status, assignedTo: params.get('assignee') });
  }

  protected onPageSize(event: Event): void {
    this.store.setPageSize(Number((event.target as HTMLSelectElement).value));
  }
}
