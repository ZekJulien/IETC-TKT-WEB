import { Injectable, signal } from '@angular/core';

const ACCESS_TOKEN_KEY = 'tkt.access-token';
const REFRESH_TOKEN_KEY = 'tkt.refresh-token';

@Injectable({
  providedIn: 'root',
})
export class SessionStore {
  readonly accessToken = signal<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY));
  readonly refreshToken = signal<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY));

  setToken(accessToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    this.accessToken.set(accessToken);
  }

  setSession(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    this.accessToken.set(accessToken);
    this.refreshToken.set(refreshToken);
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.accessToken.set(null);
    this.refreshToken.set(null);
  }

  isAuthenticated(): boolean {
    return this.accessToken() !== null;
  }
}
