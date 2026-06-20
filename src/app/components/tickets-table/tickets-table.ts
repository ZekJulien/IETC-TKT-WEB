import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Alert } from '../ui/alert/alert';
import { RouterLink } from '@angular/router';
import { Badge, BadgeTone } from '../ui/badge/badge';
import { Datatable } from '../ui/datatable/datatable';
import { DatatableCell } from '../ui/datatable/datatable-cell';
import { DatatableColumn } from '../ui/datatable/datatable-column';
import { I18nStore, TranslationKey } from '../../i18n/i18n-store';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { formatTicketNumber, TicketPriority, TicketStatus } from '../../models/tickets';
import { DirectoryStore } from '../../state/companies';
import { TicketsListStore } from '../../state/tickets';

@Component({
  selector: 'app-tickets-table',
  imports: [Alert, DatePipe, RouterLink, TranslatePipe, Datatable, DatatableCell, Badge],
  templateUrl: './tickets-table.html',
  styleUrl: './tickets-table.css',
})
export class TicketsTable {
  private readonly i18n = inject(I18nStore);
  private readonly directory = inject(DirectoryStore);
  protected readonly store = inject(TicketsListStore);

  protected readonly formatNumber = formatTicketNumber;

  protected readonly ticketLink = (row: unknown): unknown[] => [
    '/tickets',
    (row as { ticketId: string }).ticketId,
  ];

  protected readonly columns = computed<DatatableColumn[]>(() => [
    {
      key: 'ticketNumber',
      header: this.i18n.t('ticketsPage.columns.number'),
      sortable: true,
      width: 120,
    },
    { key: 'title', header: this.i18n.t('ticketsPage.columns.title'), sortable: true, flex: true },
    {
      key: 'status',
      header: this.i18n.t('ticketsPage.columns.status'),
      sortable: true,
      width: 140,
    },
    {
      key: 'priority',
      header: this.i18n.t('ticketsPage.columns.priority'),
      sortable: true,
      width: 140,
    },
    { key: 'assignedTo', header: this.i18n.t('ticketsPage.columns.assignee'), width: 180 },
    {
      key: 'createdAt',
      header: this.i18n.t('ticketsPage.columns.createdAt'),
      sortable: true,
      width: 140,
    },
  ]);

  protected statusLabelKey(status: string): TranslationKey {
    return ('ticketsPage.status.' + status) as TranslationKey;
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

  protected assigneeLabel(assignedTo: string | null): string {
    if (!assignedTo) {
      return this.i18n.t('ticketsPage.unassigned');
    }
    return this.directory.nameById().get(assignedTo) ?? this.i18n.t('ticketsPage.unassigned');
  }
}
