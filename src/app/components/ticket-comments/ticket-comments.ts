import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../ui/button/button';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { CompanyRole } from '../../models/companies';
import { Comment } from '../../models/tickets';
import { AccountStore } from '../../state/account';
import { DirectoryStore } from '../../state/companies';
import { TenantStore } from '../../state/tenant';
import { CommentsStore } from '../../state/tickets';

const INTERNAL_ROLES: readonly CompanyRole[] = [
  CompanyRole.Owner,
  CompanyRole.Admin,
  CompanyRole.Agent,
];

const CONTENT_MAX = 10000;

@Component({
  selector: 'app-ticket-comments',
  imports: [DatePipe, NgTemplateOutlet, ReactiveFormsModule, TranslatePipe, Button],
  templateUrl: './ticket-comments.html',
  styleUrl: './ticket-comments.css',
})
export class TicketComments implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly account = inject(AccountStore);
  private readonly directory = inject(DirectoryStore);
  private readonly tenant = inject(TenantStore);
  protected readonly store = inject(CommentsStore);

  readonly ticketId = input.required<string>();

  protected readonly replyingTo = signal<string | null>(null);
  protected readonly editingId = signal<string | null>(null);

  protected readonly canViewInternal = computed(() => {
    const role = this.tenant.activeRole();
    return role !== null && INTERNAL_ROLES.includes(role);
  });

  private readonly myAccountId = computed(() => {
    const email = this.account.me()?.email?.toLowerCase();
    if (!email) {
      return null;
    }
    return this.directory.members().find((m) => m.email.toLowerCase() === email)?.accountId ?? null;
  });

  protected readonly roots = computed(() =>
    this.sorted(this.store.comments().filter((c) => c.replyToId === null)),
  );

  readonly newForm = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.maxLength(CONTENT_MAX)]],
    isInternal: [false],
  });

  readonly replyControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(CONTENT_MAX)],
  });

  readonly editControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(CONTENT_MAX)],
  });

  ngOnInit(): void {
    const companyId = this.tenant.activeCompanyId();
    if (companyId) {
      this.directory.ensure(companyId);
    }
    this.store.load(this.ticketId());
  }

  protected childrenOf(commentId: string): Comment[] {
    return this.sorted(this.store.comments().filter((c) => c.replyToId === commentId));
  }

  protected authorName(accountId: string): string {
    return this.directory.nameById().get(accountId) ?? accountId;
  }

  protected authorInitials(accountId: string): string {
    const name = this.directory.nameById().get(accountId) ?? '?';
    return name.charAt(0).toUpperCase();
  }

  protected isOwn(comment: Comment): boolean {
    return comment.accountId === this.myAccountId();
  }

  protected submitNew(): void {
    if (this.newForm.invalid) {
      this.newForm.markAllAsTouched();
      return;
    }
    const raw = this.newForm.getRawValue();
    this.store.create(
      this.ticketId(),
      { content: raw.content.trim(), isInternal: raw.isInternal },
      () => this.newForm.reset({ content: '', isInternal: false }),
    );
  }

  protected startReply(commentId: string): void {
    this.editingId.set(null);
    this.replyControl.reset('');
    this.replyingTo.set(commentId);
  }

  protected cancelReply(): void {
    this.replyingTo.set(null);
  }

  protected submitReply(replyToId: string): void {
    if (this.replyControl.invalid) {
      this.replyControl.markAsTouched();
      return;
    }
    this.store.create(
      this.ticketId(),
      { content: this.replyControl.value.trim(), isInternal: false, replyToId },
      () => this.replyingTo.set(null),
    );
  }

  protected startEdit(comment: Comment): void {
    this.replyingTo.set(null);
    this.editControl.reset(comment.content);
    this.editingId.set(comment.commentId);
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
  }

  protected submitEdit(commentId: string): void {
    if (this.editControl.invalid) {
      this.editControl.markAsTouched();
      return;
    }
    this.store.update(commentId, this.editControl.value.trim(), () => this.editingId.set(null));
  }

  private sorted(comments: Comment[]): Comment[] {
    return [...comments].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
}
