import type { TranslationKey } from '../../i18n/i18n-store';

export function ticketStatusLabelKey(status: string): TranslationKey {
  return ('ticketsPage.status.' + status) as TranslationKey;
}

export function ticketPriorityLabelKey(priority: string): TranslationKey {
  return ('ticketForm.priorities.' + priority) as TranslationKey;
}
