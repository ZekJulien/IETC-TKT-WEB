import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AppRoute } from '../../app-route';
import { TenantService } from '../../api/tenant';
import { CompanyRole } from '../../models/companies';
import { MyCompany } from '../../models/tenant';
import { SessionStore } from '../auth/session-store';

const ACTIVE_COMPANY_KEY = 'tkt.active-company-id';

@Injectable({
  providedIn: 'root',
})
export class TenantStore {
  private readonly api = inject(TenantService);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly companies = signal<MyCompany[]>([]);
  readonly switchingId = signal<string | null>(null);

  readonly activeCompanyId = signal<string | null>(localStorage.getItem(ACTIVE_COMPANY_KEY));

  readonly activeCompany = computed(
    () => this.companies().find((company) => company.companyId === this.activeCompanyId()) ?? null,
  );
  readonly activeRole = computed<CompanyRole | null>(() => this.activeCompany()?.role ?? null);
  readonly hasMultiple = computed(() => this.companies().length > 1);

  loadCompanies(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .listCompanies()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ companies }) => {
          this.companies.set(companies);
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
      });
  }

  ensureCompanies(): void {
    if (this.companies().length === 0 && !this.loading()) {
      this.loadCompanies();
    }
  }

  resolveSelection(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .listCompanies()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ companies }) => {
          this.companies.set(companies);
          if (companies.length === 0) {
            this.router.navigate(['/', AppRoute.Onboarding]);
          } else if (companies.length === 1) {
            this.switchTo(companies[0].companyId);
          }
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
      });
  }

  switchTo(companyId: string): void {
    this.switchingId.set(companyId);
    this.error.set(null);

    this.api
      .switchTenant(companyId)
      .pipe(finalize(() => this.switchingId.set(null)))
      .subscribe({
        next: (tokens) => {
          this.session.setSession(tokens.accessToken, tokens.refreshToken);
          this.setActive(companyId);
          this.router.navigate(['/', AppRoute.Dashboard]);
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
      });
  }

  setActive(companyId: string): void {
    localStorage.setItem(ACTIVE_COMPANY_KEY, companyId);
    this.activeCompanyId.set(companyId);
  }

  clear(): void {
    localStorage.removeItem(ACTIVE_COMPANY_KEY);
    this.activeCompanyId.set(null);
    this.companies.set([]);
    this.error.set(null);
  }
}
