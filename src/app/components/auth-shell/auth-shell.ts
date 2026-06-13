import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationKey } from '../../i18n/i18n-store';
import { TranslatePipe } from '../../i18n/translate-pipe';

@Component({
  selector: 'app-auth-shell',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './auth-shell.html',
  styleUrl: './auth-shell.css',
})
export class AuthShell {
  readonly tagline = input<TranslationKey>('common.brand.tagline');
}
