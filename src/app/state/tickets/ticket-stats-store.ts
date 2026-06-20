import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { TicketsService } from '../../api/tickets';
import { TicketStats } from '../../models/tickets';

@Injectable({
  providedIn: 'root',
})
export class TicketStatsStore {
  private readonly api = inject(TicketsService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly stats = signal<TicketStats | null>(null);

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .getStats()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (stats) => {
          this.stats.set(stats);
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
      });
  }
}
