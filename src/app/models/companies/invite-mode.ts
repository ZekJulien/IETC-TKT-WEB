export const InviteMode = {
  DirectMember: 'DirectMember',
  PendingInvitation: 'PendingInvitation',
} as const;

export type InviteMode = (typeof InviteMode)[keyof typeof InviteMode];
