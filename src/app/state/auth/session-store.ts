import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'tkt.access-token';

@Injectable({
  providedIn: 'root',
})
export class SessionStore {
  readonly accessToken = signal<string | null>(localStorage.getItem(STORAGE_KEY));

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEY, token);
    this.accessToken.set(token);
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.accessToken.set(null);
  }

  isAuthenticated(): boolean {
    return this.accessToken() !== null;
  }
}
