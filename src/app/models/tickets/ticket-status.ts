export const TicketStatus = {
  Open: 'open',
  InProgress: 'in_progress',
  Pending: 'pending',
  Resolved: 'resolved',
  Closed: 'closed',
} as const;

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

export const TICKET_STATUSES: readonly TicketStatus[] = [
  TicketStatus.Open,
  TicketStatus.InProgress,
  TicketStatus.Pending,
  TicketStatus.Resolved,
  TicketStatus.Closed,
];
