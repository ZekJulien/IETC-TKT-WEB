export const MemberStatus = {
  Active: 'active',
  Inactive: 'inactive',
  Pending: 'pending',
} as const;

export type MemberStatus = (typeof MemberStatus)[keyof typeof MemberStatus];
