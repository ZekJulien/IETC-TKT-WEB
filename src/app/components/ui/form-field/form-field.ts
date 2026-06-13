import { Component, inject, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { I18nStore, TranslationKey } from '../../../i18n/i18n-store';

@Component({
  selector: 'app-form-field',
  imports: [],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
})
export class FormField {
  private readonly i18n = inject(I18nStore);

  readonly label = input<TranslationKey | ''>('');
  readonly control = input<AbstractControl | null>(null);
  readonly extraError = input<TranslationKey | null>(null);
  readonly hideMessage = input(false);
  readonly forId = input('');

  get labelText(): string {
    const key = this.label();
    return key ? this.i18n.t(key) : '';
  }

  get showError(): boolean {
    const c = this.control();
    return (!!c && c.invalid && c.touched) || !!this.extraError();
  }

  get message(): string | null {
    if (this.hideMessage()) {
      return null;
    }
    const extra = this.extraError();
    if (extra) {
      return this.i18n.t(extra);
    }
    const c = this.control();
    if (c && c.errors) {
      const key = Object.keys(c.errors)[0];
      return this.i18n.t(('common.errors.' + key) as TranslationKey);
    }
    return null;
  }
}
