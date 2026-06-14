import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppRoute } from '../../app-route';
import { AuthShell } from '../../components/auth-shell/auth-shell';
import { Button } from '../../components/ui/button/button';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { AuthStore } from '../../state/auth';

@Component({
  selector: 'app-verify-email-page',
  imports: [RouterLink, TranslatePipe, AuthShell, Button],
  templateUrl: './verify-email-page.html',
  styleUrl: './verify-email-page.css',
})
export class VerifyEmailPage {
  private readonly route = inject(ActivatedRoute);
  readonly store = inject(AuthStore);
  protected readonly AppRoute = AppRoute;

  readonly email = this.route.snapshot.queryParamMap.get('email') ?? '';
  readonly token = this.route.snapshot.queryParamMap.get('token') ?? '';

  constructor() {
    if (this.token) {
      this.store.confirmEmail(this.token);
    }
  }
}
