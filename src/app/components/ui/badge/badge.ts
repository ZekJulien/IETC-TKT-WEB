import { Component, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'accent' | 'amber' | 'danger';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.css',
})
export class Badge {
  readonly tone = input<BadgeTone>('neutral');
}
