import { CompanyRole } from './member-role';

export interface Member {
  accountId: string;
  email: string;
  displayName?: string | null;
  role: CompanyRole;
  isActive: boolean;
  joinedAt?: string | null;
}
