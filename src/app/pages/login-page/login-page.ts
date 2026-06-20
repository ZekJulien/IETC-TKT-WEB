import { Component, inject } from '@angular/core';
import { Alert } from '../../components/ui/alert/alert';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppRoute } from '../../app-route';
import { AuthShell } from '../../components/auth-shell/auth-shell';
import { Button } from '../../components/ui/button/button';
import { FormField } from '../../components/ui/form-field/form-field';
import { Input } from '../../components/ui/input/input';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { AuthStore } from '../../state/auth';

@Component({
  selector: 'app-login-page',
  imports: [Alert, ReactiveFormsModule, RouterLink, TranslatePipe, AuthShell, Button, FormField, Input],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  readonly store = inject(AuthStore);
  protected readonly AppRoute = AppRoute;

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.login(this.form.getRawValue());
  }
}
