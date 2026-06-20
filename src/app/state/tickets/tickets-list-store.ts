import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { TicketsService } from '../../api/tickets';
import { TicketListItem, TicketSort } from '../../models/tickets';

const DEFAULT_PAGE_SIZE = 20;
export const TICKET_PAGE_SIZES: readonly number[] = [10, 20, 50];

@Injectable({
  providedIn: 'root',
})
export class TicketsListStore {
  private readonly api = inject(TicketsService);

  readonly loading = signal(false);
  readonly loaded = signal(false);
  readonly error = signal<string | null>(null);

  readonly items = signal<TicketListItem[]>([]);
  readonly total = signal(0);
  readonly totalPages = signal(0);
  readonly statusCounts = signal<Record<string, number>>({});

  readonly page = signal(1);
  readonly pageSize = signal(DEFAULT_PAGE_SIZE);

  readonly status = signal<string | null>(null);
  readonly priority = signal<string | null>(null);
  readonly assignedTo = signal<string | null>(null);
  readonly sort = signal<TicketSort>('created_at');

  readonly hasActiveFilters = computed(
    () => this.priority() !== null || this.assignedTo() !== null,
  );

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .listTickets({
        status: this.status() ?? undefined,
        priority: this.priority() ?? undefined,
        assignedTo: this.assignedTo() ?? undefined,
        sort: this.sort(),
        page: this.page(),
        pageSize: this.pageSize(),
      })
      .pipe(
        finalize(() => {
          this.loading.set(false);
          this.loaded.set(true);
        }),
      )
      .subscribe({
        next: (res) => {
          this.items.set(res.items);
          this.total.set(res.total);
          this.totalPages.set(res.totalPages);
          this.page.set(res.page);
          this.pageSize.set(res.pageSize);
          this.statusCounts.set(res.statusCounts ?? {});
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
      });
  }

  setStatus(value: string | null): void {
    this.status.set(value);
    this.page.set(1);
    this.load();
  }

  applyQuery(filters: { status?: string | null; assignedTo?: string | null }): void {
    this.status.set(filters.status ?? null);
    this.assignedTo.set(filters.assignedTo ?? null);
    this.page.set(1);
    this.load();
  }

  setPriority(value: string | null): void {
    this.priority.set(value);
    this.page.set(1);
    this.load();
  }

  setAssignee(value: string | null): void {
    this.assignedTo.set(value);
    this.page.set(1);
    this.load();
  }

  setSort(value: TicketSort): void {
    this.sort.set(value);
    this.page.set(1);
    this.load();
  }

  setPage(value: number): void {
    const next = Math.min(Math.max(1, value), Math.max(1, this.totalPages()));
    if (next !== this.page()) {
      this.page.set(next);
      this.load();
    }
  }

  setPageSize(value: number): void {
    this.pageSize.set(value);
    this.page.set(1);
    this.load();
  }

  resetFilters(): void {
    this.status.set(null);
    this.priority.set(null);
    this.assignedTo.set(null);
    this.sort.set('created_at');
    this.page.set(1);
    this.load();
  }
}
