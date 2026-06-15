import { Component, computed, inject, signal } from '@angular/core';
import { InviteMember } from '../../components/invite-member/invite-member';
import { MemberList } from '../../components/member-list/member-list';
import { Button } from '../../components/ui/button/button';
import { Modal } from '../../components/ui/modal/modal';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { CompanyRole, INVITER_ROLES } from '../../models/companies';
import { AccountStore } from '../../state/account';
import { MembersStore } from '../../state/companies';

@Component({
  selector: 'app-members-page',
  imports: [TranslatePipe, Button, Modal, InviteMember, MemberList],
  templateUrl: './members-page.html',
  styleUrl: './members-page.css',
})
export class MembersPage {
  private readonly account = inject(AccountStore);
  protected readonly members = inject(MembersStore);

  protected readonly open = signal(false);

  private readonly inviterMembership = computed(() =>
    this.account.me()?.memberships.find((m) => INVITER_ROLES.includes(m.role as CompanyRole)),
  );

  protected readonly companyId = computed(() => this.inviterMembership()?.companyId ?? null);
  protected readonly canInvite = computed(() => this.companyId() !== null);

  protected readonly seatsUsed = computed(
    () => this.members.activeMembers() + this.members.pendingInvitations(),
  );
  protected readonly quotaRatio = computed(() => {
    const max = this.members.maxUsers();
    return max > 0 ? Math.min(1, this.seatsUsed() / max) : 0;
  });
  protected readonly quotaFull = computed(() => {
    const max = this.members.maxUsers();
    return max > 0 && this.seatsUsed() >= max;
  });

  constructor() {
    this.account.loadMe();
  }

  protected openModal(): void {
    this.open.set(true);
  }

  protected closeModal(): void {
    this.open.set(false);
    const id = this.companyId();
    if (id) {
      this.members.load(id);
    }
  }
}
