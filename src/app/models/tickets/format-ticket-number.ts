export function formatTicketNumber(raw: string): string {
  const dash = raw.lastIndexOf('-');
  if (dash === -1) {
    return raw;
  }
  const numPart = raw.slice(dash + 1);
  if (!/^\d+$/.test(numPart)) {
    return raw;
  }
  return `${raw.slice(0, dash + 1)}${Number(numPart)}`;
}
