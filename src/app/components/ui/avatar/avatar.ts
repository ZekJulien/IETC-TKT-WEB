import { booleanAttribute, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
  host: {
    class: 'avatar',
    'aria-hidden': 'true',
    '[class.avatar--round]': 'round()',
    '[class.avatar--soft]': "variant() === 'soft'",
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[style.fontSize.px]': 'fontSize()',
  },
})
export class Avatar {
  readonly name = input('');
  readonly size = input(36);
  readonly round = input(false, { transform: booleanAttribute });
  readonly variant = input<'solid' | 'soft'>('solid');

  protected readonly initial = computed(() => this.name().charAt(0).toUpperCase() || '?');
  protected readonly fontSize = computed(() => Math.round(this.size() * 0.4));
}
