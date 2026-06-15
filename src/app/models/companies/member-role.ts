export const CompanyRole = {
  Owner: 'owner',
  Admin: 'admin',
  Agent: 'agent',
  Member: 'member',
} as const;

export type CompanyRole = (typeof CompanyRole)[keyof typeof CompanyRole];

export const INVITABLE_ROLES: readonly CompanyRole[] = [
  CompanyRole.Admin,
  CompanyRole.Agent,
  CompanyRole.Member,
];

export const INVITER_ROLES: readonly CompanyRole[] = [CompanyRole.Owner, CompanyRole.Admin];
