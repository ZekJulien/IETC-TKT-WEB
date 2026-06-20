import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { TicketsService } from '../../api/tickets';
import { TicketDetail } from '../../models/tickets';

@Injectable({
  providedIn: 'root',
})
export class TicketDetailStore {
  private readonly api = inject(TicketsService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly detail = signal<TicketDetail | null>(null);

  load(ticketId: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.detail.set(null);

    this.api
      .getTicket(ticketId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (detail) => {
          this.detail.set(detail);
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
      });
  }

  refresh(ticketId: string): void {
    this.api.getTicket(ticketId).subscribe({
      next: (detail) => {
        this.detail.set(detail);
      },
    });
  }
}
