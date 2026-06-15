import { Component, computed, inject, signal } from '@angular/core';
import { InviteMember } from '../../components/invite-member/invite-member';
import { Button } from '../../components/ui/button/button';
import { Modal } from '../../components/ui/modal/modal';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { CompanyRole, INVITER_ROLES } from '../../models/companies';
import { AccountStore } from '../../state/account';

@Component({
  selector: 'app-members-page',
  imports: [TranslatePipe, Button, Modal, InviteMember],
  templateUrl: './members-page.html',
  styleUrl: './members-page.css',
})
export class MembersPage {
  private readonly account = inject(AccountStore);

  protected readonly open = signal(false);

  private readonly inviterMembership = computed(() =>
    this.account.me()?.memberships.find((m) => INVITER_ROLES.includes(m.role as CompanyRole)),
  );

  protected readonly companyId = computed(() => this.inviterMembership()?.companyId ?? null);
  protected readonly canInvite = computed(() => this.companyId() !== null);

  constructor() {
    this.account.loadMe();
  }

  protected openModal(): void {
    this.open.set(true);
  }

  protected closeModal(): void {
    this.open.set(false);
  }
}
