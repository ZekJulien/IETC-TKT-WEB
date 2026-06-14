import { Component, input } from '@angular/core';
import { TranslationKey } from '../../../i18n/i18n-store';
import { TranslatePipe } from '../../../i18n/translate-pipe';

@Component({
  selector: 'app-stepper',
  imports: [TranslatePipe],
  templateUrl: './stepper.html',
  styleUrl: './stepper.css',
})
export class Stepper {
  readonly steps = input<TranslationKey[]>([]);
  readonly current = input(0);
}
