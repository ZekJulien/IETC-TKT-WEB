import { Component, inject } from '@angular/core';
import { Button } from '../ui/button/button';
import { TranslationKey } from '../../i18n/i18n-store';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { TICKET_PRIORITIES } from '../../models/tickets';
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
  protected readonly store = inject(TicketsListStore);

  protected readonly priorities = TICKET_PRIORITIES;
  protected readonly assignableMembers = this.directory.assignable;

  protected priorityLabelKey(priority: string): TranslationKey {
    return ('ticketForm.priorities.' + priority) as TranslationKey;
  }

  protected assigneeName(accountId: string | null): string {
    if (!accountId) {
      return '';
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
