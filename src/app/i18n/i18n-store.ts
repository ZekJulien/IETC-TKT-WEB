import { Injectable, signal } from '@angular/core';
import { fr } from './fr';

export type Dictionary = typeof fr;
export type Lang = 'fr';

type Paths<T> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown> ? `${K}.${Paths<T[K]>}` : K;
}[keyof T & string];

export type TranslationKey = Paths<Dictionary>;

@Injectable({
  providedIn: 'root',
})
export class I18nStore {
  private readonly dictionaries: Record<Lang, Dictionary> = { fr };

  readonly lang = signal<Lang>('fr');

  t(key: TranslationKey, params?: Record<string, string | number>): string {
    const raw = key.split('.').reduce<unknown>((node, segment) => {
      if (node && typeof node === 'object') {
        return (node as Record<string, unknown>)[segment];
      }
      return undefined;
    }, this.dictionaries[this.lang()]);

    if (typeof raw !== 'string') {
      return key;
    }
    if (!params) {
      return raw;
    }
    return raw.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? ''));
  }
}
