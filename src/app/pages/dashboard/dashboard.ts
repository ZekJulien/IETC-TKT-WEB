import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideCheck,
  LucideHourglass,
  LucideInbox,
  LucideLoader,
  LucidePlus,
  LucideTicket,
} from '@lucide/angular';
import { AppRoute } from '../../app-route';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { TranslationKey } from '../../i18n/i18n-store';
import { CompanyRole } from '../../models/companies';
import { AccountStore } from '../../state/account';
import { TenantStore } from '../../state/tenant';
import { TicketStatsStore } from '../../state/tickets';

interface KpiCard {
  labelKey: TranslationKey;
  value: number;
  accent: 'inbox' | 'pending' | 'progress' | 'resolved' | 'total';
}

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    TranslatePipe,
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

  protected readonly cards = computed<KpiCard[]>(() => {
    const s = this.store.stats();
    if (!s) {
      return [];
    }
    return [
      { labelKey: 'dashboardPage.kpi.unassigned', value: s.unassigned, accent: 'inbox' },
      { labelKey: 'dashboardPage.kpi.pending', value: s.pending, accent: 'pending' },
      { labelKey: 'dashboardPage.kpi.inProgress', value: s.inProgress, accent: 'progress' },
      { labelKey: 'dashboardPage.kpi.resolved', value: s.resolved, accent: 'resolved' },
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
