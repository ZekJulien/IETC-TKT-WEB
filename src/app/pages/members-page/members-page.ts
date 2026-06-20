import { Component, computed, inject, signal } from '@angular/core';
import { InviteMember } from '../../components/invite-member/invite-member';
import { MemberList } from '../../components/member-list/member-list';
import { Button } from '../../components/ui/button/button';
import { Modal } from '../../components/ui/modal/modal';
import { PageHeader } from '../../components/ui/page-header/page-header';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { INVITER_ROLES } from '../../models/companies';
import { MembersStore } from '../../state/companies';
import { TenantStore } from '../../state/tenant';

@Component({
  selector: 'app-members-page',
  imports: [TranslatePipe, Button, Modal, InviteMember, MemberList, PageHeader],
  templateUrl: './members-page.html',
  styleUrl: './members-page.css',
})
export class MembersPage {
  private readonly tenant = inject(TenantStore);
  protected readonly members = inject(MembersStore);

  protected readonly open = signal(false);

  protected readonly companyId = computed(() => this.tenant.activeCompanyId());
  protected readonly canInvite = computed(() => {
    const role = this.tenant.activeRole();
    return role !== null && INVITER_ROLES.includes(role);
  });

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

  protected openModal(): void {
    this.open.set(true);
  }

  protected closeModal(): void {
    this.open.set(false);
  }

  protected onInvited(): void {
    this.open.set(false);
    const id = this.companyId();
    if (id) {
      this.members.load(id);
    }
  }
}
