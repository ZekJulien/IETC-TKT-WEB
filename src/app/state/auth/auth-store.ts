import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AppRoute } from '../../app-route';
import { AuthService } from '../../api/auth';
import { RegisterRequest } from '../../models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly api = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  register(payload: RegisterRequest): void {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .register(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/', AppRoute.VerifyEmail], { queryParams: { email: payload.email } });
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
      });
  }
}
