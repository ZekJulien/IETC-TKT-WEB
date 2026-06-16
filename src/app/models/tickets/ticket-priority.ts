export const TicketPriority = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Urgent: 'urgent',
} as const;

export type TicketPriority = (typeof TicketPriority)[keyof typeof TicketPriority];

export const TICKET_PRIORITIES: readonly TicketPriority[] = [
  TicketPriority.Low,
  TicketPriority.Medium,
  TicketPriority.High,
  TicketPriority.Urgent,
];

export const DEFAULT_TICKET_PRIORITY: TicketPriority = TicketPriority.Medium;
