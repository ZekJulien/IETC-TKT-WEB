import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { AccountService } from '../../api/account';
import { MeResponse } from '../../models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountStore {
  private readonly api = inject(AccountService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly me = signal<MeResponse | null>(null);

  loadMe(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .getMe()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (me) => {
          this.me.set(me);
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
      });
  }
}
