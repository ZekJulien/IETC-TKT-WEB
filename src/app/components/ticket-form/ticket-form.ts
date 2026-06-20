import { Component, OnInit, computed, inject, input } from '@angular/core';
import { Alert } from '../ui/alert/alert';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from '../ui/button/button';
import { FormField } from '../ui/form-field/form-field';
import { Input } from '../ui/input/input';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { CompanyRole, DirectoryMember, directoryMemberName } from '../../models/companies';
import {
  CreateTicketRequest,
  DEFAULT_TICKET_PRIORITY,
  formatTicketNumber,
  ticketPriorityLabelKey,
  TICKET_PRIORITIES,
  TicketPriority,
} from '../../models/tickets';
import { DirectoryStore } from '../../state/companies';
import { TenantStore } from '../../state/tenant';
import { TicketCreateStore } from '../../state/tickets';

const TITLE_MIN = 3;
const TITLE_MAX = 255;
const DESCRIPTION_MAX = 5000;

@Component({
  selector: 'app-ticket-form',
  imports: [Alert, ReactiveFormsModule, RouterLink, TranslatePipe, Button, FormField, Input],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css',
})
export class TicketForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly directory = inject(DirectoryStore);
  private readonly tenant = inject(TenantStore);
  readonly store = inject(TicketCreateStore);

  readonly companyId = input.required<string>();

  protected readonly priorities = TICKET_PRIORITIES;
  protected readonly titleMax = TITLE_MAX;
  protected readonly membersLoading = this.directory.loading;
  protected readonly assignableMembers = this.directory.assignable;

  protected readonly canAssign = computed(() => this.tenant.activeRole() !== CompanyRole.Member);

  readonly form = this.fb.nonNullable.group({
    title: [
      '',
      [Validators.required, Validators.minLength(TITLE_MIN), Validators.maxLength(TITLE_MAX)],
    ],
    description: ['', [Validators.maxLength(DESCRIPTION_MAX)]],
    priority: [DEFAULT_TICKET_PRIORITY as TicketPriority, [Validators.required]],
    assignedTo: [''],
    dueDate: [''],
  });

  constructor() {
    this.store.reset();
  }

  ngOnInit(): void {
    this.directory.ensure(this.companyId());
  }

  protected readonly priorityLabelKey = ticketPriorityLabelKey;

  protected memberLabel(member: DirectoryMember): string {
    return directoryMemberName(member);
  }

  protected readonly formatTicketNumber = formatTicketNumber;

  protected selectPriority(priority: TicketPriority): void {
    this.form.controls.priority.setValue(priority);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: CreateTicketRequest = {
      title: raw.title.trim(),
      priority: raw.priority,
      source: 'web',
    };

    const description = raw.description.trim();
    if (description) {
      payload.description = description;
    }
    if (raw.assignedTo) {
      payload.assignedTo = raw.assignedTo;
    }
    if (raw.dueDate) {
      payload.dueDate = `${raw.dueDate}T00:00:00Z`;
    }

    this.store.create(payload);
  }

  protected createAnother(): void {
    this.form.reset({
      priority: DEFAULT_TICKET_PRIORITY,
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
    });
    this.store.reset();
  }
}
