import { Injectable, inject, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, filter, finalize, map, shareReplay, throwError } from 'rxjs';
import { AppRoute } from '../../app-route';
import { AuthService } from '../../api/auth';
import { LoginRequest, RegisterRequest } from '../../models/auth';
import { TenantStore } from '../tenant';
import { SessionStore } from './session-store';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly api = inject(AuthService);
  private readonly router = inject(Router);
  private readonly session = inject(SessionStore);
  private readonly tenant = inject(TenantStore);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private refreshInFlight: Observable<string> | null = null;

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => this.error.set(null));
  }

  register(payload: RegisterRequest): void {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .register(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/', AppRoute.VerifyEmail], {
            queryParams: { email: payload.email },
          });
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
      });
  }

  confirmEmail(token: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .confirmEmail(token)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.session.setToken(res.accessToken);
          this.router.navigate(['/', AppRoute.Onboarding]);
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
      });
  }

  login(payload: LoginRequest): void {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .login(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (tokens) => {
          this.session.setSession(tokens.accessToken, tokens.refreshToken);
          this.tenant.clear();
          this.router.navigate(['/', AppRoute.SelectCompany]);
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
      });
  }

  logout(): void {
    this.session.clear();
    this.tenant.clear();
    this.router.navigate(['/', AppRoute.Login]);
  }

  refreshTokens(): Observable<string> {
    if (this.refreshInFlight) {
      return this.refreshInFlight;
    }

    const refreshToken = this.session.refreshToken();
    if (!refreshToken) {
      return throwError(() => new Error());
    }

    this.refreshInFlight = this.api.refresh(refreshToken).pipe(
      map((tokens) => {
        this.session.setSession(tokens.accessToken, tokens.refreshToken);
        return tokens.accessToken;
      }),
      finalize(() => {
        this.refreshInFlight = null;
      }),
      shareReplay(1),
    );

    return this.refreshInFlight;
  }
}
