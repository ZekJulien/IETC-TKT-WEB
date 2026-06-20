import { Component, computed, effect, inject } from '@angular/core';
import { Alert } from '../../components/ui/alert/alert';
import { Params, RouterLink } from '@angular/router';
import {
  LucideCheck,
  LucideHourglass,
  LucideInbox,
  LucideLoader,
  LucidePlus,
  LucideTicket,
} from '@lucide/angular';
import { AppRoute } from '../../app-route';
import { KpiAccent, KpiCard } from '../../components/ui/kpi-card/kpi-card';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { TranslationKey } from '../../i18n/i18n-store';
import { CompanyRole } from '../../models/companies';
import { TicketStatus, UNASSIGNED_ASSIGNEE } from '../../models/tickets';
import { AccountStore } from '../../state/account';
import { TenantStore } from '../../state/tenant';
import { TicketStatsStore } from '../../state/tickets';

interface KpiCardData {
  labelKey: TranslationKey;
  value: number;
  accent: KpiAccent;
  query?: Params;
}

@Component({
  selector: 'app-dashboard',
  imports: [Alert, 
    RouterLink,
    TranslatePipe,
    KpiCard,
    LucideInbox,
    LucideHourglass,
    LucideLoader,
    LucideCheck,
    LucideTicket,
    LucidePlus,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  protected readonly store = inject(TicketStatsStore);
  private readonly tenant = inject(TenantStore);
  private readonly account = inject(AccountStore);

  protected readonly newTicketLink = '/' + AppRoute.CreateTicket;
  protected readonly ticketsLink = '/' + AppRoute.Tickets;

  protected readonly canCreateTicket = computed(
    () => this.tenant.activeRole() === CompanyRole.Member,
  );

  protected readonly welcomeName = computed(() => {
    const me = this.account.me();
    if (!me) {
      return '';
    }
    const name = [me.firstName, me.lastName]
      .filter((part) => part && part.trim())
      .join(' ')
      .trim();
    return name || me.email;
  });

  protected readonly cards = computed<KpiCardData[]>(() => {
    const s = this.store.stats();
    if (!s) {
      return [];
    }
    return [
      {
        labelKey: 'dashboardPage.kpi.unassigned',
        value: s.unassigned,
        accent: 'inbox',
        query: { assignee: UNASSIGNED_ASSIGNEE },
      },
      {
        labelKey: 'dashboardPage.kpi.pending',
        value: s.pending,
        accent: 'pending',
        query: { status: TicketStatus.Pending },
      },
      {
        labelKey: 'dashboardPage.kpi.inProgress',
        value: s.inProgress,
        accent: 'progress',
        query: { status: TicketStatus.InProgress },
      },
      {
        labelKey: 'dashboardPage.kpi.resolved',
        value: s.resolved,
        accent: 'resolved',
        query: { status: TicketStatus.Resolved },
      },
      { labelKey: 'dashboardPage.kpi.total', value: s.total, accent: 'total' },
    ];
  });

  constructor() {
    effect(() => {
      if (this.tenant.activeCompanyId()) {
        this.store.load();
      }
    });
  }
}
