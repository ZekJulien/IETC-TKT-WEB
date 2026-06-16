import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { TicketsService } from '../../api/tickets';
import { CreateTicketRequest, CreateTicketResponse } from '../../models/tickets';

@Injectable({
  providedIn: 'root',
})
export class TicketCreateStore {
  private readonly api = inject(TicketsService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly result = signal<CreateTicketResponse | null>(null);

  reset(): void {
    this.loading.set(false);
    this.error.set(null);
    this.result.set(null);
  }

  create(payload: CreateTicketRequest): void {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    this.api
      .createTicket(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (result) => {
          this.result.set(result);
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
      });
  }
}
