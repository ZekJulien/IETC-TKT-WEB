import { Component, inject } from '@angular/core';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { AccountStore } from '../../state/account';

@Component({
  selector: 'app-dashboard',
  imports: [TranslatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly store = inject(AccountStore);
}
