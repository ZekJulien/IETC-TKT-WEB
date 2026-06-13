import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { AppRoute } from '../../app-route';
import { AuthShell } from '../../components/auth-shell/auth-shell';
import { Button } from '../../components/ui/button/button';
import { TranslatePipe } from '../../i18n/translate-pipe';

@Component({
  selector: 'app-verify-email-page',
  imports: [RouterLink, TranslatePipe, AuthShell, Button],
  templateUrl: './verify-email-page.html',
  styleUrl: './verify-email-page.css',
})
export class VerifyEmailPage {
  private readonly route = inject(ActivatedRoute);
  protected readonly AppRoute = AppRoute;

  readonly email = toSignal(this.route.queryParamMap.pipe(map((params) => params.get('email') ?? '')), {
    initialValue: '',
  });
}
