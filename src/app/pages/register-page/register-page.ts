import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppRoute } from '../../app-route';
import { AuthShell } from '../../components/auth-shell/auth-shell';
import { Button } from '../../components/ui/button/button';
import { FormField } from '../../components/ui/form-field/form-field';
import { Input } from '../../components/ui/input/input';
import { PasswordRules } from '../../components/ui/password-rules/password-rules';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { AuthStore } from '../../state/auth';
import { AuthValidators } from '../../validators/auth';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, AuthShell, Button, FormField, Input, PasswordRules],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  readonly store = inject(AuthStore);
  protected readonly AppRoute = AppRoute;

  readonly form = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, AuthValidators.password]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: AuthValidators.passwordsMatch },
  );

  get confirmMismatch(): boolean {
    return this.form.hasError(AuthValidators.PASSWORD_MISMATCH) && this.form.controls.confirmPassword.touched;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.register(this.form.getRawValue());
  }
}
