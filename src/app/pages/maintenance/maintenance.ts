import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoute } from '../../app-route';
import { AuthShell } from '../../components/auth-shell/auth-shell';
import { Button } from '../../components/ui/button/button';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { ServerStore } from '../../state/server';

@Component({
  selector: 'app-maintenance',
  imports: [AuthShell, Button, TranslatePipe],
  templateUrl: './maintenance.html',
  styleUrl: './maintenance.css',
})
export class Maintenance {
  private readonly router = inject(Router);
  private readonly server = inject(ServerStore);

  protected goBack(): void {
    const url = this.server.returnUrl();
    const target = url && url !== '/' + AppRoute.Maintenance ? url : '/';
    this.router.navigateByUrl(target);
  }
}
