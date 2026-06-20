import { Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

export type KpiAccent = 'inbox' | 'pending' | 'progress' | 'resolved' | 'total';

@Component({
  selector: 'app-kpi-card',
  imports: [RouterLink],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCard {
  readonly value = input.required<number>();
  readonly label = input.required<string>();
  readonly accent = input<KpiAccent>('total');
  readonly link = input<unknown[] | string | null>(null);
  readonly queryParams = input<Params | null>(null);
}
