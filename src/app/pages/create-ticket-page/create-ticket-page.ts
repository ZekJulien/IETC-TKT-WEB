import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoute } from '../../app-route';
import { TicketForm } from '../../components/ticket-form/ticket-form';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { TenantStore } from '../../state/tenant';

@Component({
  selector: 'app-create-ticket-page',
  imports: [TranslatePipe, TicketForm],
  templateUrl: './create-ticket-page.html',
  styleUrl: './create-ticket-page.css',
})
export class CreateTicketPage {
  private readonly tenant = inject(TenantStore);
  private readonly router = inject(Router);

  protected readonly companyId = computed(() => this.tenant.activeCompanyId());

  protected onDone(): void {
    this.router.navigate(['/', AppRoute.Dashboard]);
  }
}
