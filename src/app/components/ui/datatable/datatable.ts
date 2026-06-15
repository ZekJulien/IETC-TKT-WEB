import {
  Component,
  ElementRef,
  HostListener,
  TemplateRef,
  computed,
  contentChildren,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DatatableCell } from './datatable-cell';
import { DatatableColumn } from './datatable-column';

const MIN_WIDTH = 64;
const DEFAULT_WIDTH = 160;

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

  private readonly tableRef = viewChild<ElementRef<HTMLTableElement>>('tableEl');
  private readonly cells = contentChildren(DatatableCell);

  private readonly sortKey = signal<string | null>(null);
  private readonly sortDir = signal<SortDirection>('asc');
  private readonly filters = signal<Record<string, string>>({});
  private readonly openFilters = signal<Record<string, boolean>>({});
  private readonly widths = signal<Record<string, number>>({});

  private resizing: {
    key: string;
    nextKey: string;
    startX: number;
    startW: number;
    startWNext: number;
  } | null = null;

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

  protected readonly flexKey = computed(() => {
    const cols = this.columns();
    return cols.find((c) => c.flex)?.key ?? cols.at(-1)?.key ?? null;
  });

  protected isFlex(col: DatatableColumn): boolean {
    return col.key === this.flexKey();
  }

  protected columnWidth(col: DatatableColumn): string {
    const stored = this.widths()[col.key];
    if (stored != null) {
      return stored + 'px';
    }
    if (this.isFlex(col)) {
      return 'auto';
    }
    return (col.width ?? DEFAULT_WIDTH) + 'px';
  }

  protected currentSort(key: string): SortDirection | null {
    return this.sortKey() === key ? this.sortDir() : null;
  }

  protected trackRow(index: number, row: unknown): unknown {
    const key = this.trackKey();
    return (key ? this.cellValue(row, key) : null) ?? index;
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

  protected filterOpen(key: string): boolean {
    return this.openFilters()[key] ?? false;
  }

  protected toggleFilter(key: string, event: Event): void {
    event.stopPropagation();
    const open = !this.filterOpen(key);
    this.openFilters.update((o) => ({ ...o, [key]: open }));
    if (open) {
      setTimeout(() => document.getElementById('dt-filter-' + key)?.focus());
    } else {
      this.filters.update((f) => ({ ...f, [key]: '' }));
    }
  }

  protected closeFilter(key: string, event: Event): void {
    event.stopPropagation();
    this.openFilters.update((o) => ({ ...o, [key]: false }));
    this.filters.update((f) => ({ ...f, [key]: '' }));
  }

  protected canResize(isLast: boolean): boolean {
    return !isLast;
  }

  protected startResize(event: PointerEvent, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    const cols = this.columns();
    const next = cols[index + 1];
    const ths = this.tableRef()?.nativeElement.querySelectorAll('thead th');
    if (!next || !ths) {
      return;
    }

    if (Object.keys(this.widths()).length === 0) {
      const snapshot: Record<string, number> = {};
      cols.forEach((c, idx) => {
        const th = ths[idx] as HTMLElement | undefined;
        snapshot[c.key] = th ? th.offsetWidth : DEFAULT_WIDTH;
      });
      this.widths.set(snapshot);
    }

    const widths = this.widths();
    this.resizing = {
      key: cols[index].key,
      nextKey: next.key,
      startX: event.clientX,
      startW: widths[cols[index].key],
      startWNext: widths[next.key],
    };
  }

  @HostListener('window:pointermove', ['$event'])
  protected onResizeMove(event: PointerEvent): void {
    const r = this.resizing;
    if (!r) {
      return;
    }
    event.preventDefault();
    const min = MIN_WIDTH - r.startW;
    const max = r.startWNext - MIN_WIDTH;
    const delta = Math.max(min, Math.min(max, event.clientX - r.startX));
    this.widths.update((w) => ({
      ...w,
      [r.key]: r.startW + delta,
      [r.nextKey]: r.startWNext - delta,
    }));
  }

  @HostListener('window:pointerup')
  protected endResize(): void {
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
