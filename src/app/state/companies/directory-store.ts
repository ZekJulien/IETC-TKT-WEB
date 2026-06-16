import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CompaniesService } from '../../api/companies';
import { CompanyRole, DirectoryMember, directoryMemberName } from '../../models/companies';

@Injectable({
  providedIn: 'root',
})
export class DirectoryStore {
  private readonly api = inject(CompaniesService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly members = signal<DirectoryMember[]>([]);

  private loadedCompanyId: string | null = null;

  /** Membres pouvant être assignés à un ticket (owner/admin/agent). */
  readonly assignable = computed(() => this.members().filter((m) => m.role !== CompanyRole.Member));

  /** Map accountId → nom affichable (fallback email). */
  readonly nameById = computed(() => {
    const map = new Map<string, string>();
    for (const member of this.members()) {
      map.set(member.accountId, directoryMemberName(member));
    }
    return map;
  });

  ensure(companyId: string): void {
    if (this.loadedCompanyId === companyId && this.members().length > 0) {
      return;
    }
    this.load(companyId);
  }

  load(companyId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .listDirectory(companyId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (members) => {
          this.members.set(members);
          this.loadedCompanyId = companyId;
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
      });
  }
}
