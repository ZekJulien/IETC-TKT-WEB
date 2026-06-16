import { Component, computed, inject } from '@angular/core';
import { Button } from '../ui/button/button';
import { I18nStore, TranslationKey } from '../../i18n/i18n-store';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { Member, MemberStatus } from '../../models/companies';
import { TICKET_PRIORITIES } from '../../models/tickets';
import { MembersStore } from '../../state/companies';
import { TicketsListStore } from '../../state/tickets';

@Component({
  selector: 'app-tickets-toolbar',
  imports: [TranslatePipe, Button],
  templateUrl: './tickets-toolbar.html',
  styleUrl: './tickets-toolbar.css',
})
export class TicketsToolbar {
  private readonly i18n = inject(I18nStore);
  private readonly members = inject(MembersStore);
  protected readonly store = inject(TicketsListStore);

  protected readonly priorities = TICKET_PRIORITIES;

  protected readonly assignableMembers = computed<Member[]>(() =>
    this.members.members().filter((m) => m.status === MemberStatus.Active && m.accountId !== null),
  );

  protected priorityLabelKey(priority: string): TranslationKey {
    return ('ticketForm.priorities.' + priority) as TranslationKey;
  }

  protected assigneeName(accountId: string | null): string {
    if (!accountId) {
      return '';
    }
    const member = this.members.members().find((m) => m.accountId === accountId);
    return member ? member.displayName?.trim() || member.email : accountId;
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
