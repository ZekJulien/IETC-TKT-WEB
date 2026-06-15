import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountStore } from '../../state/account';
import { TenantStore } from '../../state/tenant';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Navbar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private readonly account = inject(AccountStore);
  private readonly tenant = inject(TenantStore);

  constructor() {
    this.account.loadMe();
    this.tenant.ensureCompanies();
  }
}
