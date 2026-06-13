import { Component, computed, input } from '@angular/core';
import { TranslationKey } from '../../../i18n/i18n-store';
import { TranslatePipe } from '../../../i18n/translate-pipe';
import { AuthValidators } from '../../../validators/auth';

@Component({
  selector: 'app-password-rules',
  imports: [TranslatePipe],
  templateUrl: './password-rules.html',
  styleUrl: './password-rules.css',
})
export class PasswordRules {
  readonly value = input('');

  protected readonly rules = computed<{ ok: boolean; key: TranslationKey }[]>(() => {
    const c = AuthValidators.checks(this.value());
    return [
      { ok: c.minLength, key: 'passwordRules.minLength' },
      { ok: c.upper, key: 'passwordRules.upper' },
      { ok: c.digit, key: 'passwordRules.digit' },
    ];
  });
}
