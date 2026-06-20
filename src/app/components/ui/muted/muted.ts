import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'app-muted',
  imports: [],
  templateUrl: './muted.html',
  styleUrl: './muted.css',
  host: {
    '[class.muted--pad]': 'pad()',
    '[class.muted--base]': "size() === 'base'",
  },
})
export class Muted {
  readonly pad = input(false, { transform: booleanAttribute });
  readonly size = input<'sm' | 'base'>('sm');
}
