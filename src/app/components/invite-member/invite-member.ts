import { Component, inject, input, output } from '@angular/core';
import { Alert } from '../ui/alert/alert';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../ui/button/button';
import { FormField } from '../ui/form-field/form-field';
import { Input } from '../ui/input/input';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { TranslationKey } from '../../i18n/i18n-store';
import {
  CompanyRole,
  INVITABLE_ROLES,
  InviteMemberRequest,
  InviteMode,
} from '../../models/companies';
import { InviteStore } from '../../state/companies';

@Component({
  selector: 'app-invite-member',
  imports: [Alert, ReactiveFormsModule, TranslatePipe, Button, FormField, Input],
  templateUrl: './invite-member.html',
  styleUrl: './invite-member.css',
})
export class InviteMember {
  private readonly fb = inject(FormBuilder);
  readonly store = inject(InviteStore);

  readonly companyId = input.required<string>();
  readonly done = output<void>();

  protected readonly roles = INVITABLE_ROLES;

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    role: [CompanyRole.Member as CompanyRole, [Validators.required]],
    department: ['', [Validators.maxLength(100)]],
    jobTitle: ['', [Validators.maxLength(100)]],
  });

  constructor() {
    this.store.reset();
  }

  protected roleLabelKey(role: CompanyRole): TranslationKey {
    return ('common.roles.' + role) as TranslationKey;
  }

  protected successKey(): TranslationKey {
    return this.store.result()?.mode === InviteMode.PendingInvitation
      ? 'inviteMember.success.pending'
      : 'inviteMember.success.direct';
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: InviteMemberRequest = {
      email: raw.email.trim(),
      role: raw.role,
    };

    const department = raw.department.trim();
    if (department) {
      payload.department = department;
    }
    const jobTitle = raw.jobTitle.trim();
    if (jobTitle) {
      payload.jobTitle = jobTitle;
    }

    this.store.invite(this.companyId(), payload);
  }

  protected another(): void {
    this.form.reset();
    this.store.reset();
  }

  protected finish(): void {
    this.done.emit();
  }
}
