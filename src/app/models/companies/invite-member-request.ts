import { CompanyRole } from './member-role';

export interface InviteMemberRequest {
  email: string;
  role: CompanyRole;
  department?: string;
  jobTitle?: string;
}
