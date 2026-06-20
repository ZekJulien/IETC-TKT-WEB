import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { Avatar } from '../ui/avatar/avatar';
import { TranslationKey } from '../../i18n/i18n-store';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { CompanyRole } from '../../models/companies';
import { MyCompany } from '../../models/tenant';
import { TenantStore } from '../../state/tenant';

@Component({
  selector: 'app-tenant-switcher',
  imports: [TranslatePipe, Avatar],
  templateUrl: './tenant-switcher.html',
  styleUrl: './tenant-switcher.css',
})
export class TenantSwitcher {
  protected readonly store = inject(TenantStore);

  protected readonly open = signal(false);

  protected readonly activeName = computed(() => this.store.activeCompany()?.companyName ?? '');

  protected toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.open.update((value) => !value);
  }

  @HostListener('document:click')
  protected close(): void {
    this.open.set(false);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.open.set(false);
  }

  protected select(company: MyCompany): void {
    this.open.set(false);
    if (company.companyId !== this.store.activeCompanyId()) {
      this.store.switchTo(company.companyId);
    }
  }

  protected isActive(company: MyCompany): boolean {
    return company.companyId === this.store.activeCompanyId();
  }

  protected roleLabelKey(role: CompanyRole): TranslationKey {
    return ('common.roles.' + role) as TranslationKey;
  }
}
