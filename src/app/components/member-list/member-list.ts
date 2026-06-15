import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Badge, BadgeTone } from '../ui/badge/badge';
import { Button } from '../ui/button/button';
import { Datatable } from '../ui/datatable/datatable';
import { DatatableCell } from '../ui/datatable/datatable-cell';
import { DatatableColumn } from '../ui/datatable/datatable-column';
import { Modal } from '../ui/modal/modal';
import { I18nStore, TranslationKey } from '../../i18n/i18n-store';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { CompanyRole, INVITABLE_ROLES, Member } from '../../models/companies';
import { MembersStore } from '../../state/companies';

@Component({
  selector: 'app-member-list',
  imports: [DatePipe, TranslatePipe, Datatable, DatatableCell, Badge, Button, Modal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList implements OnInit {
  private readonly i18n = inject(I18nStore);
  readonly store = inject(MembersStore);

  readonly companyId = input.required<string>();

  protected readonly roles = INVITABLE_ROLES;
  protected readonly pendingDeactivate = signal<Member | null>(null);

  protected readonly columns = computed<DatatableColumn[]>(() => [
    {
      key: 'displayName',
      header: this.i18n.t('membersPage.columns.name'),
      sortable: true,
      filterable: true,
      width: 200,
    },
    {
      key: 'email',
      header: this.i18n.t('membersPage.columns.email'),
      sortable: true,
      filterable: true,
      flex: true,
    },
    { key: 'role', header: this.i18n.t('membersPage.columns.role'), sortable: true, width: 160 },
    {
      key: 'isActive',
      header: this.i18n.t('membersPage.columns.status'),
      sortable: true,
      width: 130,
    },
    {
      key: 'joinedAt',
      header: this.i18n.t('membersPage.columns.joinedAt'),
      sortable: true,
      width: 150,
    },
    {
      key: 'actions',
      header: this.i18n.t('membersPage.columns.actions'),
      width: 150,
      align: 'end',
    },
  ]);

  ngOnInit(): void {
    this.store.load(this.companyId());
  }

  protected roleLabelKey(role: string): TranslationKey {
    return ('common.roles.' + role) as TranslationKey;
  }

  protected roleTone(role: string): BadgeTone {
    switch (role) {
      case CompanyRole.Owner:
        return 'amber';
      case CompanyRole.Admin:
        return 'accent';
      case CompanyRole.Agent:
        return 'info';
      case CompanyRole.Member:
        return 'violet';
      default:
        return 'neutral';
    }
  }

  protected memberName(member: Member): string {
    return member.displayName?.trim() || member.email;
  }

  protected isOwner(member: Member): boolean {
    return member.role === CompanyRole.Owner;
  }

  protected isBusy(member: Member): boolean {
    return this.store.busyAccountId() === member.accountId;
  }

  protected onRoleChange(member: Member, event: Event): void {
    const role = (event.target as HTMLSelectElement).value as CompanyRole;
    if (role !== member.role) {
      this.store.changeRole(this.companyId(), member.accountId, role);
    }
  }

  protected reactivate(member: Member): void {
    this.store.setActive(this.companyId(), member.accountId, true);
  }

  protected askDeactivate(member: Member): void {
    this.pendingDeactivate.set(member);
  }

  protected cancelDeactivate(): void {
    this.pendingDeactivate.set(null);
  }

  protected confirmDeactivate(): void {
    const member = this.pendingDeactivate();
    if (member) {
      this.store.setActive(this.companyId(), member.accountId, false);
      this.pendingDeactivate.set(null);
    }
  }
}
