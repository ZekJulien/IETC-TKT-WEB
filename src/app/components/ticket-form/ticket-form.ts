import { Component, OnInit, computed, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../ui/button/button';
import { FormField } from '../ui/form-field/form-field';
import { Input } from '../ui/input/input';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { TranslationKey } from '../../i18n/i18n-store';
import { Member, MemberStatus } from '../../models/companies';
import {
  CreateTicketRequest,
  DEFAULT_TICKET_PRIORITY,
  TICKET_PRIORITIES,
  TicketPriority,
} from '../../models/tickets';
import { MembersStore } from '../../state/companies';
import { TicketCreateStore } from '../../state/tickets';

const TITLE_MIN = 3;
const TITLE_MAX = 255;
const DESCRIPTION_MAX = 5000;

@Component({
  selector: 'app-ticket-form',
  imports: [ReactiveFormsModule, TranslatePipe, Button, FormField, Input],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css',
})
export class TicketForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly members = inject(MembersStore);
  readonly store = inject(TicketCreateStore);

  readonly companyId = input.required<string>();
  readonly done = output<void>();

  protected readonly priorities = TICKET_PRIORITIES;
  protected readonly titleMax = TITLE_MAX;
  protected readonly membersLoading = this.members.loading;

  protected readonly assignableMembers = computed<Member[]>(() =>
    this.members.members().filter((m) => m.status === MemberStatus.Active && m.accountId !== null),
  );

  readonly form = this.fb.nonNullable.group({
    title: [
      '',
      [Validators.required, Validators.minLength(TITLE_MIN), Validators.maxLength(TITLE_MAX)],
    ],
    description: ['', [Validators.maxLength(DESCRIPTION_MAX)]],
    priority: [DEFAULT_TICKET_PRIORITY as TicketPriority, [Validators.required]],
    assignedTo: [''],
  });

  constructor() {
    this.store.reset();
  }

  ngOnInit(): void {
    this.members.load(this.companyId());
  }

  protected priorityLabelKey(priority: TicketPriority): TranslationKey {
    return ('ticketForm.priorities.' + priority) as TranslationKey;
  }

  protected memberLabel(member: Member): string {
    return member.displayName?.trim() || member.email;
  }

  protected formatTicketNumber(raw: string): string {
    const dash = raw.lastIndexOf('-');
    if (dash === -1) {
      return raw;
    }
    const numPart = raw.slice(dash + 1);
    if (!/^\d+$/.test(numPart)) {
      return raw;
    }
    return `${raw.slice(0, dash + 1)}${Number(numPart)}`;
  }

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

    this.store.create(payload);
  }

  protected createAnother(): void {
    this.form.reset({
      priority: DEFAULT_TICKET_PRIORITY,
      title: '',
      description: '',
      assignedTo: '',
    });
    this.store.reset();
  }

  protected finish(): void {
    this.done.emit();
  }
}
