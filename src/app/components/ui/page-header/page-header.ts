import { Component, input } from '@angular/core';
import { TranslationKey } from '../../../i18n/i18n-store';
import { TranslatePipe } from '../../../i18n/translate-pipe';

@Component({
  selector: 'app-page-header',
  imports: [TranslatePipe],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  readonly title = input.required<TranslationKey>();
  readonly subtitle = input<TranslationKey>();
}
