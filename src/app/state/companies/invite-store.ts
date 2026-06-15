import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CompaniesService } from '../../api/companies';
import { InviteMemberRequest, InviteMemberResponse } from '../../models/companies';

@Injectable({
  providedIn: 'root',
})
export class InviteStore {
  private readonly api = inject(CompaniesService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly result = signal<InviteMemberResponse | null>(null);
  readonly invitedEmail = signal<string | null>(null);

  reset(): void {
    this.loading.set(false);
    this.error.set(null);
    this.result.set(null);
    this.invitedEmail.set(null);
  }

  invite(companyId: string, payload: InviteMemberRequest): void {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    this.api
      .inviteMember(companyId, payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (result) => {
          this.invitedEmail.set(payload.email);
          this.result.set(result);
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
      });
  }
}
