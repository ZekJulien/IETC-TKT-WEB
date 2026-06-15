import { CompanyRole } from './member-role';
import { MemberStatus } from './member-status';

export interface Member {
  accountId: string | null;
  invitationId: string | null;
  email: string;
  displayName?: string | null;
  role: CompanyRole;
  status: MemberStatus;
  joinedAt?: string | null;
}
