import { CompanyRole } from './member-role';

export interface DirectoryMember {
  accountId: string;
  email: string;
  role: CompanyRole;
  firstName: string | null;
  lastName: string | null;
}

export function directoryMemberName(member: DirectoryMember): string {
  const name = [member.firstName, member.lastName]
    .filter((part) => part && part.trim())
    .join(' ')
    .trim();
  return name || member.email;
}
