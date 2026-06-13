import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nStore, TranslationKey } from './i18n-store';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nStore);

  transform(key: TranslationKey, params?: Record<string, string | number>): string {
    return this.i18n.t(key, params);
  }
}
