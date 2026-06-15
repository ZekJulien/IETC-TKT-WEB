import { CompanyRole } from './member-role';

export interface ChangeMemberRoleResponse {
  accountId: string;
  role: CompanyRole;
}
