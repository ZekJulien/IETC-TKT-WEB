import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CompaniesService } from '../../api/companies';
import { CompanyRole, Member } from '../../models/companies';

const PAGE_SIZE = 100;

@Injectable({
  providedIn: 'root',
})
export class MembersStore {
  private readonly api = inject(CompaniesService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly members = signal<Member[]>([]);
  readonly total = signal(0);
  readonly activeMembers = signal(0);
  readonly maxUsers = signal(0);
  readonly actionError = signal<string | null>(null);
  readonly busyAccountId = signal<string | null>(null);

  load(companyId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .listMembers(companyId, { pageSize: PAGE_SIZE })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (page) => {
          this.members.set(page.items);
          this.total.set(page.total);
          this.activeMembers.set(page.activeMembers);
          this.maxUsers.set(page.maxUsers);
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
      });
  }

  changeRole(companyId: string, accountId: string, role: CompanyRole): void {
    this.actionError.set(null);
    this.busyAccountId.set(accountId);

    this.api
      .changeMemberRole(companyId, accountId, role)
      .pipe(finalize(() => this.busyAccountId.set(null)))
      .subscribe({
        next: (res) => {
          this.patchMember(res.accountId, { role: res.role });
        },
        error: (err: Error) => {
          this.actionError.set(err.message);
        },
      });
  }

  setActive(companyId: string, accountId: string, isActive: boolean): void {
    this.actionError.set(null);
    this.busyAccountId.set(accountId);

    this.api
      .setMemberStatus(companyId, accountId, isActive)
      .pipe(finalize(() => this.busyAccountId.set(null)))
      .subscribe({
        next: (res) => {
          this.patchMember(res.accountId, { isActive: res.isActive });
          this.activeMembers.update((n) => Math.max(0, n + (res.isActive ? 1 : -1)));
        },
        error: (err: Error) => {
          this.actionError.set(err.message);
        },
      });
  }

  private patchMember(accountId: string, change: Partial<Member>): void {
    this.members.update((list) =>
      list.map((m) => (m.accountId === accountId ? { ...m, ...change } : m)),
    );
  }
}
