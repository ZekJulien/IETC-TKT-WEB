import { Component, HostListener, Signal, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppRoute } from '../../app-route';
import { TranslationKey } from '../../i18n/i18n-store';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { INVITER_ROLES } from '../../models/companies';
import { AccountStore } from '../../state/account';
import { AuthStore } from '../../state/auth';
import { TenantStore } from '../../state/tenant';
import { TenantSwitcher } from '../tenant-switcher/tenant-switcher';

type NavIcon = 'dashboard' | 'members' | 'tickets';

interface NavItem {
  route: string;
  labelKey: TranslationKey;
  icon: NavIcon;
  show: Signal<boolean>;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, TenantSwitcher],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly account = inject(AccountStore);
  private readonly auth = inject(AuthStore);
  private readonly tenant = inject(TenantStore);

  protected readonly menuOpen = signal(false);

  protected readonly displayName = computed(() => {
    const me = this.account.me();
    if (!me) {
      return '';
    }
    const name = [me.firstName, me.lastName]
      .filter((part) => part && part.trim())
      .join(' ')
      .trim();
    return name || me.email;
  });

  protected readonly initials = computed(() => this.displayName().charAt(0).toUpperCase() || '?');

  protected readonly canManageMembers = computed(() => {
    const role = this.tenant.activeRole();
    return role !== null && INVITER_ROLES.includes(role);
  });

  protected readonly navItems: NavItem[] = [
    {
      route: AppRoute.Dashboard,
      labelKey: 'navbar.dashboard',
      icon: 'dashboard',
      show: signal(true),
    },
    {
      route: AppRoute.Tickets,
      labelKey: 'navbar.tickets',
      icon: 'tickets',
      show: signal(true),
    },
    {
      route: AppRoute.Members,
      labelKey: 'navbar.members',
      icon: 'members',
      show: this.canManageMembers,
    },
  ];

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
