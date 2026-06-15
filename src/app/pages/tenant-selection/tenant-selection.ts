import { Component, inject } from '@angular/core';
import { AuthShell } from '../../components/auth-shell/auth-shell';
import { TranslationKey } from '../../i18n/i18n-store';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { CompanyRole } from '../../models/companies';
import { MyCompany } from '../../models/tenant';
import { TenantStore } from '../../state/tenant';

@Component({
  selector: 'app-tenant-selection',
  imports: [AuthShell, TranslatePipe],
  templateUrl: './tenant-selection.html',
  styleUrl: './tenant-selection.css',
})
export class TenantSelection {
  protected readonly store = inject(TenantStore);

  constructor() {
    this.store.resolveSelection();
  }

  protected select(company: MyCompany): void {
    this.store.switchTo(company.companyId);
  }

  protected initial(company: MyCompany): string {
    return company.companyName.charAt(0).toUpperCase();
  }

  protected roleLabelKey(role: CompanyRole): TranslationKey {
    return ('common.roles.' + role) as TranslationKey;
  }
}
