import { Component, inject } from '@angular/core';
import { Button } from '../ui/button/button';
import { I18nStore } from '../../i18n/i18n-store';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { ticketPriorityLabelKey, TICKET_PRIORITIES, UNASSIGNED_ASSIGNEE } from '../../models/tickets';
import { DirectoryStore } from '../../state/companies';
import { TicketsListStore } from '../../state/tickets';

@Component({
  selector: 'app-tickets-toolbar',
  imports: [TranslatePipe, Button],
  templateUrl: './tickets-toolbar.html',
  styleUrl: './tickets-toolbar.css',
})
export class TicketsToolbar {
  private readonly directory = inject(DirectoryStore);
  private readonly i18n = inject(I18nStore);
  protected readonly store = inject(TicketsListStore);

  protected readonly priorities = TICKET_PRIORITIES;
  protected readonly assignableMembers = this.directory.assignable;
  protected readonly unassigned = UNASSIGNED_ASSIGNEE;

  protected readonly priorityLabelKey = ticketPriorityLabelKey;

  protected assigneeName(accountId: string | null): string {
    if (!accountId) {
      return '';
    }
    if (accountId === UNASSIGNED_ASSIGNEE) {
      return this.i18n.t('ticketsPage.unassigned');
    }
    return this.directory.nameById().get(accountId) ?? accountId;
  }

  protected onPriority(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.store.setPriority(value || null);
  }

  protected onAssignee(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.store.setAssignee(value || null);
  }
}
