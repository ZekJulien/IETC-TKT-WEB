import { Component, computed, inject } from '@angular/core';
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

  protected readonly companyId = computed(() => this.tenant.activeCompanyId());
}
