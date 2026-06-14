import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppRoute } from '../../app-route';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { AccountStore } from '../../state/account';
import { AuthStore } from '../../state/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly account = inject(AccountStore);
  private readonly auth = inject(AuthStore);
  protected readonly AppRoute = AppRoute;

  protected readonly menuOpen = signal(false);

  protected readonly displayName = computed(() => this.account.me()?.email ?? '');
  protected readonly initials = computed(
    () => (this.account.me()?.email ?? '').charAt(0).toUpperCase() || '?',
  );

  protected toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen.update((open) => !open);
  }

  @HostListener('document:click')
  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.menuOpen.set(false);
  }

  protected logout(): void {
    this.auth.logout();
  }
}
