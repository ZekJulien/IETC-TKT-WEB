import { AbstractControl, ValidatorFn } from '@angular/forms';

export interface PasswordChecks {
  minLength: boolean;
  upper: boolean;
  digit: boolean;
}

export class AuthValidators {
  static readonly PASSWORD_MISMATCH = 'passwordMismatch';

  static checks(value: string | null | undefined): PasswordChecks {
    const v = value ?? '';
    return {
      minLength: v.length >= 8,
      upper: /[A-Z]/.test(v),
      digit: /[0-9]/.test(v),
    };
  }

  static readonly password: ValidatorFn = (control: AbstractControl) => {
    const c = AuthValidators.checks(control.value);
    return c.minLength && c.upper && c.digit ? null : { passwordRules: true };
  };

  static readonly passwordsMatch: ValidatorFn = (group: AbstractControl) => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (!confirm) {
      return null;
    }
    return password === confirm ? null : { [AuthValidators.PASSWORD_MISMATCH]: true };
  };
}
