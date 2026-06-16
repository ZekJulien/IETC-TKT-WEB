import { TicketStatus } from './ticket-status';

export const TICKET_TRANSITIONS: Record<string, readonly TicketStatus[]> = {
  [TicketStatus.Open]: [TicketStatus.InProgress],
  [TicketStatus.InProgress]: [TicketStatus.Pending, TicketStatus.Resolved],
  [TicketStatus.Pending]: [TicketStatus.InProgress, TicketStatus.Resolved],
  [TicketStatus.Resolved]: [TicketStatus.Closed, TicketStatus.InProgress],
  [TicketStatus.Closed]: [TicketStatus.InProgress],
};

export function canTransition(from: string, to: string): boolean {
  if (from === to) {
    return true;
  }
  return (TICKET_TRANSITIONS[from] ?? []).includes(to as TicketStatus);
}
