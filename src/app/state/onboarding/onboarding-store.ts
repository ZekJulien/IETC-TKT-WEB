import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, finalize } from 'rxjs';
import { AppRoute } from '../../app-route';
import { OnboardingService } from '../../api/onboarding';
import { AuthTokens } from '../../models/auth';
import { CreateCompanyRequest, JoinInvitationRequest } from '../../models/onboarding';
import { SessionStore } from '../auth';
import { TenantStore } from '../tenant';
import { OnboardingStep } from './onboarding-step';

@Injectable({
  providedIn: 'root',
})
export class OnboardingStore {
  private readonly api = inject(OnboardingService);
  private readonly router = inject(Router);
  private readonly session = inject(SessionStore);
  private readonly tenant = inject(TenantStore);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly step = signal<OnboardingStep>(OnboardingStep.Choice);

  go(step: OnboardingStep): void {
    this.error.set(null);
    this.step.set(step);
  }

  reset(): void {
    this.error.set(null);
    this.step.set(OnboardingStep.Choice);
  }

  createCompany(payload: CreateCompanyRequest): void {
    this.complete(this.api.createCompany(payload));
  }

  joinInvitation(payload: JoinInvitationRequest): void {
    this.complete(this.api.joinInvitation(payload));
  }

  private complete(request: Observable<AuthTokens & { companyId: string }>): void {
    this.loading.set(true);
    this.error.set(null);

    request.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (result) => {
        this.session.setSession(result.accessToken, result.refreshToken);
        this.tenant.setActive(result.companyId);
        this.router.navigate(['/', AppRoute.Dashboard]);
      },
      error: (err: Error) => {
        this.error.set(err.message);
      },
    });
  }
}
