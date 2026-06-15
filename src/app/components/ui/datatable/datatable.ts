import { Component, TemplateRef, computed, contentChildren, input, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DatatableCell } from './datatable-cell';
import { DatatableColumn } from './datatable-column';

const DEFAULT_WIDTH = 160;
const MIN_WIDTH = 64;

type Row = Record<string, unknown>;
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-datatable',
  imports: [NgTemplateOutlet],
  templateUrl: './datatable.html',
  styleUrl: './datatable.css',
})
export class Datatable {
  readonly columns = input<DatatableColumn[]>([]);
  readonly rows = input<readonly unknown[]>([]);
  readonly trackKey = input<string | null>(null);
  readonly filterPlaceholder = input('');
  readonly emptyLabel = input('');

  private readonly cells = contentChildren(DatatableCell);

  private readonly sortKey = signal<string | null>(null);
  private readonly sortDir = signal<SortDirection>('asc');
  private readonly filters = signal<Record<string, string>>({});
  private readonly widths = signal<Record<string, number>>({});

  private resizing: { key: string; startX: number; startWidth: number } | null = null;

  protected readonly hasFilters = computed(() => this.columns().some((c) => c.filterable));

  protected readonly view = computed<Row[]>(() => {
    const rows = (this.rows() as Row[]).slice();
    const filters = this.filters();
    const filtered = rows.filter((row) =>
      this.columns().every((col) => {
        const term = (filters[col.key] ?? '').trim().toLowerCase();
        if (!col.filterable || !term) {
          return true;
        }
        return this.display(row, col.key).toLowerCase().includes(term);
      }),
    );

    const key = this.sortKey();
    if (key) {
      const dir = this.sortDir() === 'asc' ? 1 : -1;
      filtered.sort((a, b) => this.compare(a[key], b[key]) * dir);
    }
    return filtered;
  });

  protected cellValue(row: unknown, key: string): unknown {
    return (row as Row)[key];
  }

  protected templateFor(key: string): TemplateRef<{ $implicit: unknown }> | null {
    return this.cells().find((c) => c.key() === key)?.template ?? null;
  }

  protected colWidth(key: string): number {
    return this.widths()[key] ?? this.columns().find((c) => c.key === key)?.width ?? DEFAULT_WIDTH;
  }

  protected currentSort(key: string): SortDirection | null {
    return this.sortKey() === key ? this.sortDir() : null;
  }

  protected trackRow(index: number, row: unknown): unknown {
    const key = this.trackKey();
    return key ? this.cellValue(row, key) : index;
  }

  protected toggleSort(col: DatatableColumn): void {
    if (!col.sortable) {
      return;
    }
    if (this.sortKey() === col.key) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(col.key);
      this.sortDir.set('asc');
    }
  }

  protected filterValue(key: string): string {
    return this.filters()[key] ?? '';
  }

  protected setFilter(key: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filters.update((f) => ({ ...f, [key]: value }));
  }

  protected startResize(event: PointerEvent, col: DatatableColumn): void {
    event.preventDefault();
    event.stopPropagation();
    this.resizing = { key: col.key, startX: event.clientX, startWidth: this.colWidth(col.key) };
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected onResizeMove(event: PointerEvent): void {
    if (!this.resizing) {
      return;
    }
    const delta = event.clientX - this.resizing.startX;
    const next = Math.max(MIN_WIDTH, this.resizing.startWidth + delta);
    const key = this.resizing.key;
    this.widths.update((w) => ({ ...w, [key]: next }));
  }

  protected endResize(event: PointerEvent): void {
    if (!this.resizing) {
      return;
    }
    (event.target as HTMLElement).releasePointerCapture(event.pointerId);
    this.resizing = null;
  }

  private display(row: Row, key: string): string {
    const value = row[key];
    return value === null || value === undefined ? '' : String(value);
  }

  private compare(a: unknown, b: unknown): number {
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }
    if (typeof a === 'boolean' && typeof b === 'boolean') {
      return a === b ? 0 : a ? 1 : -1;
    }
    return String(a ?? '').localeCompare(String(b ?? ''));
  }
}
