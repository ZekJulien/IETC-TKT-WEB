import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { TicketsService } from '../../api/tickets';
import { TicketComments } from '../../components/ticket-comments/ticket-comments';
import { Badge, BadgeTone } from '../../components/ui/badge/badge';
import { Button } from '../../components/ui/button/button';
import { I18nStore, TranslationKey } from '../../i18n/i18n-store';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { CompanyRole, DirectoryMember, directoryMemberName } from '../../models/companies';
import {
  canTransition,
  formatTicketNumber,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  TicketPriority,
  TicketStatus,
  UpdateTicketRequest,
} from '../../models/tickets';
import { DirectoryStore } from '../../state/companies';
import { TenantStore } from '../../state/tenant';
import { TicketDetailStore } from '../../state/tickets';

const MODIFIER_ROLES: readonly CompanyRole[] = [
  CompanyRole.Owner,
  CompanyRole.Admin,
  CompanyRole.Agent,
];

interface TimelineEvent {
  labelKey: TranslationKey;
  date: string | null;
}

@Component({
  selector: 'app-ticket-detail-page',
  imports: [
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    TranslatePipe,
    Badge,
    Button,
    TicketComments,
  ],
  templateUrl: './ticket-detail-page.html',
  styleUrl: './ticket-detail-page.css',
})
export class TicketDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(TicketsService);
  private readonly tenant = inject(TenantStore);
  private readonly directory = inject(DirectoryStore);
  protected readonly store = inject(TicketDetailStore);

  protected readonly formatNumber = formatTicketNumber;
  protected readonly statuses = TICKET_STATUSES;
  protected readonly priorities = TICKET_PRIORITIES;

  protected readonly editing = signal(false);
  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);

  protected readonly canModify = computed(() => {
    const role = this.tenant.activeRole();
    return role !== null && MODIFIER_ROLES.includes(role);
  });

  protected readonly assignableMembers = this.directory.assignable;

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

  readonly form = this.fb.nonNullable.group({
    status: '' as TicketStatus | '',
    priority: '',
    assignedTo: '',
    dueDate: '',
  });

  ngOnInit(): void {
    const companyId = this.tenant.activeCompanyId();
    if (companyId) {
      this.directory.ensure(companyId);
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
    return this.directory.nameById().get(accountId) ?? accountId;
  }

  protected memberLabel(member: DirectoryMember): string {
    return directoryMemberName(member);
  }

  protected canSelectStatus(status: TicketStatus): boolean {
    const current = this.store.detail()?.status;
    return current ? canTransition(current, status) : false;
  }

  protected selectStatus(status: TicketStatus): void {
    if (this.canSelectStatus(status)) {
      this.form.controls.status.setValue(status);
    }
  }

  protected startEdit(): void {
    const ticket = this.store.detail();
    if (!ticket) {
      return;
    }
    this.saveError.set(null);
    this.form.setValue({
      status: ticket.status as TicketStatus,
      priority: ticket.priority,
      assignedTo: ticket.assignedTo ?? '',
      dueDate: ticket.dueDate ? ticket.dueDate.slice(0, 10) : '',
    });
    this.editing.set(true);
  }

  protected cancelEdit(): void {
    this.editing.set(false);
    this.saveError.set(null);
  }

  protected save(): void {
    const ticket = this.store.detail();
    if (!ticket) {
      return;
    }
    const raw = this.form.getRawValue();
    const payload: UpdateTicketRequest = {};

    if (raw.status && raw.status !== ticket.status) {
      payload.status = raw.status;
    }
    if (raw.priority && raw.priority !== ticket.priority) {
      payload.priority = raw.priority;
    }
    if (raw.assignedTo && raw.assignedTo !== ticket.assignedTo) {
      payload.assignedTo = raw.assignedTo;
    }
    if (raw.dueDate) {
      payload.dueDate = `${raw.dueDate}T00:00:00Z`;
    }

    this.saving.set(true);
    this.saveError.set(null);

    this.api
      .updateTicket(ticket.ticketId, payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (detail) => {
          this.store.detail.set(detail);
          this.editing.set(false);
        },
        error: (err: Error) => {
          this.saveError.set(err.message);
        },
      });
  }
}
